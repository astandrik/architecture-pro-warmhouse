export class DeviceRegistryClient {
  constructor(
    private readonly baseUrl: string = process.env.DEVICE_REGISTRY_URL ||
      "http://device-registry:8093"
  ) {}
  async exists(deviceId: string): Promise<boolean> {
    try {
      const res = await fetch(
        `${this.baseUrl}/v1/devices/${encodeURIComponent(deviceId)}`
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}
