import { IHermesAdapter, HermesChatRequest, HermesAdapterOptions } from './IHermesAdapter';
import { safeLogger } from '@/lib/logger';

export interface HermesGatewayConfig {
  gatewayUrl: string;
  gatewaySecret?: string;
  timeoutMs?: number;
  allowInsecureHttp?: boolean;
}

export class HermesGatewayAdapter implements IHermesAdapter {
  private readonly gatewayUrl: string;
  private readonly gatewaySecret?: string;
  private readonly timeoutMs: number;

  constructor(config?: Partial<HermesGatewayConfig>) {
    const rawUrl = config?.gatewayUrl || process.env.HERMES_GATEWAY_URL || '';
    this.timeoutMs = config?.timeoutMs || Number(process.env.HERMES_TIMEOUT_MS) || 10000;
    this.gatewaySecret = config?.gatewaySecret || process.env.HERMES_GATEWAY_SECRET;

    const isProduction = process.env.NODE_ENV === 'production';
    const allowInsecure = config?.allowInsecureHttp ?? (process.env.ALLOW_INSECURE_HERMES_HTTP === 'true');

    if (!rawUrl) {
      throw new Error('HERMES_GATEWAY_URL tidak dikonfigurasi pada pelayan.');
    }

    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      throw new Error('Format HERMES_GATEWAY_URL tidak sah.');
    }

    if (isProduction && parsed.protocol !== 'https:' && !allowInsecure) {
      throw new Error(
        'Protokol HTTP tidak selamat ditolak dalam mod produksi. Sila gunakan HTTPS untuk HERMES_GATEWAY_URL.'
      );
    }

    // Strip trailing slash
    this.gatewayUrl = rawUrl.replace(/\/+$/, '');
  }

  async streamChat(
    request: HermesChatRequest,
    options: HermesAdapterOptions
  ): Promise<ReadableStream<Uint8Array>> {
    const { signal, requestId } = options;

    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      timeoutController.abort(new Error('UPSTREAM_TIMEOUT'));
    }, this.timeoutMs);

    // Combine timeout controller and incoming client abort signal
    const combinedSignal = signal
      ? anySignal([signal, timeoutController.signal])
      : timeoutController.signal;

    safeLogger.info('Hermes request initiated', {
      requestId,
      userId: request.userId,
      agent: request.agentId,
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-request-id': requestId,
    };

    if (this.gatewaySecret) {
      headers['X-Aura-Secret'] = this.gatewaySecret;
    }

    try {
      // Step 1: Initialize session on Hermes gateway
      const startRes = await fetch(`${this.gatewayUrl}/api/chat/start`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: request.message,
          session_id: request.sessionId,
          agent_id: request.agentId,
          user_id: request.userId,
        }),
        signal: combinedSignal,
      });

      if (!startRes.ok) {
        throw new Error(`Upstream gateway returned status ${startRes.status}`);
      }

      const startData = (await startRes.json()) as { stream_id?: string };
      if (!startData || !startData.stream_id) {
        throw new Error('Upstream gateway did not return a stream_id');
      }

      // Step 2: Connect to SSE stream
      const streamRes = await fetch(
        `${this.gatewayUrl}/api/chat/stream?stream_id=${encodeURIComponent(startData.stream_id)}`,
        {
          headers: {
            'x-request-id': requestId,
            ...(this.gatewaySecret ? { 'X-Aura-Secret': this.gatewaySecret } : {}),
          },
          signal: combinedSignal,
        }
      );

      clearTimeout(timeoutId);

      if (!streamRes.ok || !streamRes.body) {
        throw new Error(`Upstream stream connection failed with status ${streamRes.status}`);
      }

      safeLogger.info('Hermes stream connected', {
        requestId,
        userId: request.userId,
      });

      return streamRes.body;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (
        (err instanceof Error && err.name === 'AbortError') ||
        timeoutController.signal.aborted
      ) {
        if (signal?.aborted) {
          safeLogger.warn('Hermes request aborted by client', { requestId });
          throw new Error('CLIENT_ABORTED');
        }
        safeLogger.warn('Hermes request timed out', {
          requestId,
          durationMs: this.timeoutMs,
        });
        throw new Error('UPSTREAM_TIMEOUT');
      }

      safeLogger.error('Hermes gateway connection failed', {
        requestId,
        errorDetail: err instanceof Error ? err.message : String(err),
      });
      throw new Error('UPSTREAM_ERROR');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.gatewayUrl}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Helper to combine multiple AbortSignals safely.
 */
function anySignal(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const sig of signals) {
    if (sig.aborted) {
      controller.abort(sig.reason);
      return controller.signal;
    }
    sig.addEventListener('abort', () => controller.abort(sig.reason), { once: true });
  }
  return controller.signal;
}
