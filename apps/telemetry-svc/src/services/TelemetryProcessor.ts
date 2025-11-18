import { TelemetrySample } from "../domain/TelemetrySample";
import { TelemetryRepository } from "../repo/TelemetryRepository";

export class TelemetryProcessor {
  constructor(private readonly repo: TelemetryRepository) {}

  async ingest(dto: {
    device_id: string;
    timestamp: string;
    metric_type: string;
    value_number?: number | null;
    value_text?: string | null;
  }): Promise<void> {
    if (!dto.device_id || !dto.timestamp || !dto.metric_type) {
      throw new Error("device_id, timestamp and metric_type are required");
    }
    if (dto.value_number == null && (dto.value_text == null || dto.value_text === "")) {
      throw new Error("Either value_number or value_text must be provided");
    }
    const sample = new TelemetrySample({
      deviceId: dto.device_id,
      timestamp: new Date(dto.timestamp),
      metricType: dto.metric_type,
      valueNumber: dto.value_number == null ? undefined : dto.value_number,
      valueText: dto.value_text == null ? undefined : dto.value_text,
    });
    await this.repo.add(sample);
  }
}


