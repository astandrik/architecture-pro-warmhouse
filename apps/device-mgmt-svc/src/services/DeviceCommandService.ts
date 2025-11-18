import { v4 as uuidv4 } from "uuid";
import { DeviceCommand } from "../domain/DeviceCommand";
import { CommandRepository } from "../repo/CommandRepository";
import { DeviceAdapterRouter } from "../adapters/DeviceAdapterRouter";
import { AccessPolicy } from "../policy/AccessPolicy";
import { DeviceRegistryClient } from "../integrations/DeviceRegistryClient";

export class DeviceCommandService {
  constructor(
    private readonly repo: CommandRepository,
    private readonly router: DeviceAdapterRouter,
    private readonly policy: AccessPolicy,
    private readonly registry: DeviceRegistryClient
  ) {}

  async createCommand(dto: {
    device_id: string;
    command_type: string;
    payload?: Record<string, unknown>;
    scenario_id?: string;
    user_id?: string; // optional, for access policy
  }): Promise<{ commandId: string; status: string }> {
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
    const id = uuidv4();
    const command = new DeviceCommand({
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

  async getById(id: string): Promise<DeviceCommand | undefined> {
    return this.repo.findById(id);
  }
}
