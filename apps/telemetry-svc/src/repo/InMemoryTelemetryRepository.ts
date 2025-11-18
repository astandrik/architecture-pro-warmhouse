import { TelemetrySample } from "../domain/TelemetrySample";
import { TelemetryRepository } from "./TelemetryRepository";

export class InMemoryTelemetryRepository implements TelemetryRepository {
  private readonly samplesByDevice: Map<string, TelemetrySample[]> = new Map();

  async add(sample: TelemetrySample): Promise<void> {
    const arr = this.samplesByDevice.get(sample.deviceId) ?? [];
    arr.unshift(sample);
    // keep last 1000
    if (arr.length > 1000) {
      arr.length = 1000;
    }
    this.samplesByDevice.set(sample.deviceId, arr);
  }

  async getByDeviceId(
    deviceId: string,
    limit: number
  ): Promise<TelemetrySample[]> {
    const arr = this.samplesByDevice.get(deviceId) ?? [];
    return arr.slice(0, Math.max(0, limit));
  }
}
