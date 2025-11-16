"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryTelemetryRepository = void 0;
class InMemoryTelemetryRepository {
    constructor() {
        this.samplesByDevice = new Map();
    }
    async add(sample) {
        const arr = this.samplesByDevice.get(sample.deviceId) ?? [];
        arr.unshift(sample);
        // keep last 1000
        if (arr.length > 1000) {
            arr.length = 1000;
        }
        this.samplesByDevice.set(sample.deviceId, arr);
    }
    async getByDeviceId(deviceId, limit) {
        const arr = this.samplesByDevice.get(deviceId) ?? [];
        return arr.slice(0, Math.max(0, limit));
    }
}
exports.InMemoryTelemetryRepository = InMemoryTelemetryRepository;
