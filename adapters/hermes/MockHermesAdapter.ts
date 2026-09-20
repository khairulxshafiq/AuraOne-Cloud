import { IHermesAdapter, HermesChatRequest, HermesAdapterOptions } from './IHermesAdapter';

export interface MockHermesOptions {
  simulatedDelayMs?: number;
  shouldTimeout?: boolean;
  shouldFail?: boolean;
  fixedResponseText?: string;
}

export class MockHermesAdapter implements IHermesAdapter {
  public lastRequest?: HermesChatRequest;
  public lastOptions?: HermesAdapterOptions;

  constructor(private readonly options: MockHermesOptions = {}) {}

  async streamChat(
    request: HermesChatRequest,
    options: HermesAdapterOptions,
  ): Promise<ReadableStream<Uint8Array>> {
    this.lastRequest = request;
    this.lastOptions = options;

    if (this.options.shouldTimeout) {
      throw new Error('UPSTREAM_TIMEOUT');
    }

    if (this.options.shouldFail) {
      throw new Error('UPSTREAM_ERROR');
    }

    const responseText =
      this.options.fixedResponseText ||
      `[Mock Hermes Response for ${request.agentId}]: Mesej "${request.message}" diproses dengan selamat.`;

    const encoder = new TextEncoder();
    const words = responseText.split(' ');
    const delay = this.options.simulatedDelayMs ?? 1;

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        for (const word of words) {
          if (options.signal?.aborted) {
            controller.error(new Error('CLIENT_ABORTED'));
            return;
          }
          const chunk = `data: ${JSON.stringify({ text: word + ' ' })}\n\n`;
          controller.enqueue(encoder.encode(chunk));
          if (delay > 0) {
            await new Promise((r) => setTimeout(r, delay));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });
  }

  async healthCheck(): Promise<boolean> {
    return !this.options.shouldFail;
  }
}
