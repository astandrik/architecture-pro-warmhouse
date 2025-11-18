export type CommandStatus = "queued" | "sent" | "done" | "failed";

export class DeviceCommand {
  readonly id: string;
  readonly deviceId: string;
  readonly commandType: string;
  readonly payload?: Record<string, unknown>;
  readonly scenarioId?: string;
  status: CommandStatus;
  readonly createdAt: Date;
  executedAt?: Date;

  constructor(params: {
    id: string;
    deviceId: string;
    commandType: string;
    payload?: Record<string, unknown>;
    scenarioId?: string;
    status?: CommandStatus;
    createdAt?: Date;
    executedAt?: Date;
  }) {
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


