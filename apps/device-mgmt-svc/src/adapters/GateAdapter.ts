import { DeviceAdapter } from "./DeviceAdapter";
import { DeviceCommand } from "../domain/DeviceCommand";

export class GateAdapter implements DeviceAdapter {
  async sendCommand(_command: DeviceCommand): Promise<void> {
    return;
  }
}
