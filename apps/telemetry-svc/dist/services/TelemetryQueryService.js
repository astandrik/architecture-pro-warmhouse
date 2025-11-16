"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryQueryService = void 0;
class TelemetryQueryService {
    constructor(repo) {
        this.repo = repo;
    }
    async get(deviceId, limit) {
        return this.repo.getByDeviceId(deviceId, limit);
    }
}
exports.TelemetryQueryService = TelemetryQueryService;
