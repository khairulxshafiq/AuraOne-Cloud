export const MAX_MESSAGE_CONTENT_LENGTH = 4000;
export const MAX_REQUEST_BODY_BYTES = 65536; // 64 KB
export const MAX_MESSAGE_COUNT = 30;

export const ALLOWED_ROLES = ['user', 'assistant', 'system'] as const;
export type MessageRole = typeof ALLOWED_ROLES[number];

export const ALLOWED_AGENTS = [
  'Aura',
  'Aura-Trade',
  'Aura-Pen',
  'Aura-Art',
  'Aura-Scout',
  'Aura-Vision',
] as const;

export type AllowedAgent = typeof ALLOWED_AGENTS[number];

export const DEFAULT_AGENT: AllowedAgent = 'Aura';

export const AGENT_HERMES_MAPPING: Record<AllowedAgent, string> = {
  'Aura': 'aura',
  'Aura-Trade': 'aura-trade',
  'Aura-Pen': 'aura-pen',
  'Aura-Art': 'aura-art',
  'Aura-Scout': 'aura-scout',
  'Aura-Vision': 'aura-vision',
};

export interface ValidatedChatMessage {
  role: MessageRole;
  content: string;
}

export interface ValidatedChatPayload {
  message: string;
  sessionId: string;
  agent: AllowedAgent;
  hermesAgentId: string;
  history?: ValidatedChatMessage[];
}

export type ValidationResult =
  | { valid: true; data: ValidatedChatPayload }
  | { valid: false; status: 400 | 413; error: string; code: 'INVALID_INPUT' | 'PAYLOAD_TOO_LARGE' };

/**
 * Validates raw JSON request body defensively.
 */
export function validateChatPayload(rawBody: unknown, byteLength?: number): ValidationResult {
  if (byteLength !== undefined && byteLength > MAX_REQUEST_BODY_BYTES) {
    return {
      valid: false,
      status: 413,
      code: 'PAYLOAD_TOO_LARGE',
      error: 'Saiz permintaan melebihi had maksimum 64KB.',
    };
  }

  if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    return {
      valid: false,
      status: 400,
      code: 'INVALID_INPUT',
      error: 'Format data mestilah objek JSON yang sah.',
    };
  }

  const record = rawBody as Record<string, unknown>;

  // Check for message text
  let message = '';
  if (typeof record.message === 'string') {
    message = record.message.trim();
  }

  // Check for message history array if provided
  let history: ValidatedChatMessage[] | undefined;
  if (record.messages !== undefined) {
    if (!Array.isArray(record.messages)) {
      return {
        valid: false,
        status: 400,
        code: 'INVALID_INPUT',
        error: 'Medan "messages" mestilah dalam bentuk senarai (array).',
      };
    }

    if (record.messages.length > MAX_MESSAGE_COUNT) {
      return {
        valid: false,
        status: 400,
        code: 'INVALID_INPUT',
        error: `Jumlah mesej melebihi had maksimum ${MAX_MESSAGE_COUNT}.`,
      };
    }

    history = [];
    for (let i = 0; i < record.messages.length; i++) {
      const item = record.messages[i];
      if (!item || typeof item !== 'object') {
        return {
          valid: false,
          status: 400,
          code: 'INVALID_INPUT',
          error: `Mesej pada indeks ${i} tidak sah.`,
        };
      }

      const role = (item as Record<string, unknown>).role;
      const content = (item as Record<string, unknown>).content;

      if (typeof role !== 'string' || !ALLOWED_ROLES.includes(role as MessageRole)) {
        return {
          valid: false,
          status: 400,
          code: 'INVALID_INPUT',
          error: `Peranan mesej (role) "${role}" tidak dibenarkan.`,
        };
      }

      if (typeof content !== 'string' || content.trim().length === 0) {
        return {
          valid: false,
          status: 400,
          code: 'INVALID_INPUT',
          error: `Kandungan mesej pada indeks ${i} tidak boleh kosong.`,
        };
      }

      if (content.length > MAX_MESSAGE_CONTENT_LENGTH) {
        return {
          valid: false,
          status: 413,
          code: 'PAYLOAD_TOO_LARGE',
          error: `Kandungan mesej pada indeks ${i} melebihi had ${MAX_MESSAGE_CONTENT_LENGTH} aksara.`,
        };
      }

      history.push({
        role: role as MessageRole,
        content: content.trim(),
      });
    }

    // If message was not directly provided but history exists, derive from last user message
    if (!message && history.length > 0) {
      const lastMsg = history[history.length - 1];
      if (lastMsg.role === 'user') {
        message = lastMsg.content;
      }
    }
  }

  if (!message || message.length === 0) {
    return {
      valid: false,
      status: 400,
      code: 'INVALID_INPUT',
      error: 'Mesej pengguna tidak boleh kosong.',
    };
  }

  if (message.length > MAX_MESSAGE_CONTENT_LENGTH) {
    return {
      valid: false,
      status: 413,
      code: 'PAYLOAD_TOO_LARGE',
      error: `Mesej melebihi had panjang ${MAX_MESSAGE_CONTENT_LENGTH} aksara.`,
    };
  }

  // Session ID validation
  let sessionId = 'default';
  if (record.sessionId !== undefined) {
    if (typeof record.sessionId !== 'string' || record.sessionId.length > 128) {
      return {
        valid: false,
        status: 400,
        code: 'INVALID_INPUT',
        error: 'ID sesi tidak sah.',
      };
    }
    sessionId = record.sessionId.trim() || 'default';
  }

  // Agent validation
  let agent: AllowedAgent = DEFAULT_AGENT;
  if (record.agent !== undefined && record.agent !== null && record.agent !== '') {
    if (typeof record.agent !== 'string' || !ALLOWED_AGENTS.includes(record.agent as AllowedAgent)) {
      return {
        valid: false,
        status: 400,
        code: 'INVALID_INPUT',
        error: `Ejen "${String(record.agent)}" tidak wujud dalam senarai sah.`,
      };
    }
    agent = record.agent as AllowedAgent;
  }

  const hermesAgentId = AGENT_HERMES_MAPPING[agent];

  return {
    valid: true,
    data: {
      message,
      sessionId,
      agent,
      hermesAgentId,
      ...(history ? { history } : {}),
    },
  };
}

