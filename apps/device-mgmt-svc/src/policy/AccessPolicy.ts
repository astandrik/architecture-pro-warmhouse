export class AccessPolicy {
  // Stub allow-all policy for MVP
  async canControl(
    _userId: string | undefined,
    _deviceId: string
  ): Promise<boolean> {
    return true;
  }
}
