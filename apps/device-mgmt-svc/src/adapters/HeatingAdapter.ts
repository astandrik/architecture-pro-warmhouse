import { DeviceAdapter } from "./DeviceAdapter";
import { DeviceCommand } from "../domain/DeviceCommand";

export class HeatingAdapter implements DeviceAdapter {
  async sendCommand(_command: DeviceCommand): Promise<void> {
    // Stub: publish to bus in future
    return;
  }
}
