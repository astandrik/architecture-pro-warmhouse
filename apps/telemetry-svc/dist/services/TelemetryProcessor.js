"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryProcessor = void 0;
const TelemetrySample_1 = require("../domain/TelemetrySample");
class TelemetryProcessor {
    constructor(repo) {
        this.repo = repo;
    }
    async ingest(dto) {
        if (!dto.device_id || !dto.timestamp || !dto.metric_type) {
            throw new Error("device_id, timestamp and metric_type are required");
        }
        if (dto.value_number == null && (dto.value_text == null || dto.value_text === "")) {
            throw new Error("Either value_number or value_text must be provided");
        }
        const sample = new TelemetrySample_1.TelemetrySample({
            deviceId: dto.device_id,
            timestamp: new Date(dto.timestamp),
            metricType: dto.metric_type,
            valueNumber: dto.value_number == null ? undefined : dto.value_number,
            valueText: dto.value_text == null ? undefined : dto.value_text,
        });
        await this.repo.add(sample);
    }
}
exports.TelemetryProcessor = TelemetryProcessor;
