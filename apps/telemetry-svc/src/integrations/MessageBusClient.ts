export class MessageBusClient {
  // Stub for future broker integration
  async publish(_topic: string, _message: unknown): Promise<void> {
    return;
  }
}
