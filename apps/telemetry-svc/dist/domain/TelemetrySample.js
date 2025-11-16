"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetrySample = void 0;
class TelemetrySample {
    constructor(params) {
        this.deviceId = params.deviceId;
        this.timestamp = params.timestamp;
        this.metricType = params.metricType;
        this.valueNumber = params.valueNumber;
        this.valueText = params.valueText;
    }
}
exports.TelemetrySample = TelemetrySample;
