import { DeviceCommand } from "../domain/DeviceCommand";
import { CommandRepository } from "./CommandRepository";

export class InMemoryCommandRepository implements CommandRepository {
  private readonly map = new Map<string, DeviceCommand>();
  async save(command: DeviceCommand): Promise<void> {
    this.map.set(command.id, command);
  }
  async findById(id: string): Promise<DeviceCommand | undefined> {
    return this.map.get(id);
  }
}
