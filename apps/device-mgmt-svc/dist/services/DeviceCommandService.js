"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceCommandService = void 0;
const uuid_1 = require("uuid");
const DeviceCommand_1 = require("../domain/DeviceCommand");
class DeviceCommandService {
    constructor(repo, router, policy, registry) {
        this.repo = repo;
        this.router = router;
        this.policy = policy;
        this.registry = registry;
    }
    async createCommand(dto) {
        if (!dto.device_id || !dto.command_type) {
            throw new Error("device_id and command_type are required");
        }
        const exists = await this.registry.exists(dto.device_id);
        if (!exists) {
            throw new Error("device not found");
        }
        const allowed = await this.policy.canControl(dto.user_id, dto.device_id);
        if (!allowed) {
            throw new Error("forbidden");
        }
        const id = (0, uuid_1.v4)();
        const command = new DeviceCommand_1.DeviceCommand({
            id,
            deviceId: dto.device_id,
            commandType: dto.command_type,
            payload: dto.payload,
            scenarioId: dto.scenario_id,
            status: "queued",
        });
        await this.repo.save(command);
        // simulate dispatch
        const adapter = this.router.route(command);
        await adapter.sendCommand(command);
        return { commandId: id, status: "queued" };
    }
    async getById(id) {
        return this.repo.findById(id);
    }
}
exports.DeviceCommandService = DeviceCommandService;
