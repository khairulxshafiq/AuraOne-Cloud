export type ErrorCategory =
  | 'AUTH_REQUIRED'
  | 'FORBIDDEN'
  | 'INVALID_INPUT'
  | 'PAYLOAD_TOO_LARGE'
  | 'RATE_LIMITED'
  | 'UPSTREAM_TIMEOUT'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR';

export interface SafeErrorResponse {
  error: {
    code: ErrorCategory;
    message: string;
    requestId?: string;
    retryAfter?: number;
  };
}

export function createSafeErrorResponse(
  status: number,
  code: ErrorCategory,
  message: string,
  requestId?: string,
  retryAfter?: number,
): Response {
  const body: SafeErrorResponse = {
    error: {
      code,
      message,
      ...(requestId ? { requestId } : {}),
      ...(retryAfter !== undefined ? { retryAfter } : {}),
    },
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requestId) {
    headers['x-request-id'] = requestId;
  }
  if (retryAfter !== undefined) {
    headers['Retry-After'] = String(retryAfter);
  }

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}
