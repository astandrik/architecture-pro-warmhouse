import { TelemetryRepository } from "../repo/TelemetryRepository";
import { TelemetrySample } from "../domain/TelemetrySample";

export class TelemetryQueryService {
  constructor(private readonly repo: TelemetryRepository) {}

  async get(deviceId: string, limit: number): Promise<TelemetrySample[]> {
    return this.repo.getByDeviceId(deviceId, limit);
  }
}
