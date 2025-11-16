import { TelemetrySample } from "../domain/TelemetrySample";

export interface TelemetryRepository {
  add(sample: TelemetrySample): Promise<void>;
  getByDeviceId(deviceId: string, limit: number): Promise<TelemetrySample[]>;
}
