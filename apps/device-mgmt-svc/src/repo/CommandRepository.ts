import { DeviceCommand } from "../domain/DeviceCommand";

export interface CommandRepository {
  save(command: DeviceCommand): Promise<void>;
  findById(id: string): Promise<DeviceCommand | undefined>;
}
