export type LogLevel = 'info' | 'warn' | 'error';

export interface StructuredLogPayload {
  level: LogLevel;
  event: string;
  requestId: string;
  userId?: string;
  agent?: string;
  durationMs?: number;
  statusCode?: number;
  errorCategory?: string;
  errorDetail?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Safe structured logger that outputs single-line JSON.
 * Strictly avoids logging prompt content, tokens, cookies, or credentials.
 */
export const safeLogger = {
  log(payload: StructuredLogPayload) {
    const entry = {
      timestamp: new Date().toISOString(),
      ...payload,
    };

    const json = JSON.stringify(entry);

    if (payload.level === 'error') {
      console.error(json);
    } else if (payload.level === 'warn') {
      console.warn(json);
    } else {
      console.log(json);
    }
  },

  info(event: string, meta: Omit<StructuredLogPayload, 'level' | 'event'>) {
    this.log({ level: 'info', event, ...meta });
  },

  warn(event: string, meta: Omit<StructuredLogPayload, 'level' | 'event'>) {
    this.log({ level: 'warn', event, ...meta });
  },

  error(event: string, meta: Omit<StructuredLogPayload, 'level' | 'event'>) {
    this.log({ level: 'error', event, ...meta });
  },
};
