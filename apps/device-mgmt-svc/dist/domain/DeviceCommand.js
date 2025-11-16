"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceCommand = void 0;
class DeviceCommand {
    constructor(params) {
        this.id = params.id;
        this.deviceId = params.deviceId;
        this.commandType = params.commandType;
        this.payload = params.payload;
        this.scenarioId = params.scenarioId;
        this.status = params.status ?? "queued";
        this.createdAt = params.createdAt ?? new Date();
        this.executedAt = params.executedAt;
    }
}
exports.DeviceCommand = DeviceCommand;
