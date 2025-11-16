import { DeviceCommand } from "../domain/DeviceCommand";

export interface DeviceAdapter {
  sendCommand(command: DeviceCommand): Promise<void>;
}
