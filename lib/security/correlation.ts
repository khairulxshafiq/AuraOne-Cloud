import { randomUUID } from 'crypto';

const SAFE_REQUEST_ID_REGEX = /^[a-zA-Z0-9_-]{16,64}$/;

/**
 * Validates incoming x-request-id or generates a cryptographically random UUID.
 */
export function resolveRequestId(incomingId?: string | null): string {
  if (incomingId && SAFE_REQUEST_ID_REGEX.test(incomingId)) {
    return incomingId;
  }
  return randomUUID();
}
