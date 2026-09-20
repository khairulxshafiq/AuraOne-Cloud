export interface HermesChatRequest {
  message: string;
  sessionId: string;
  agentId: string;
  userId: string;
}

export interface HermesAdapterOptions {
  signal?: AbortSignal;
  requestId: string;
}

export interface IHermesAdapter {
  streamChat(
    request: HermesChatRequest,
    options: HermesAdapterOptions,
  ): Promise<ReadableStream<Uint8Array>>;
  healthCheck(): Promise<boolean>;
}
