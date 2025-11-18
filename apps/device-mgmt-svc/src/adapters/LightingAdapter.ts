import { DeviceAdapter } from "./DeviceAdapter";
import { DeviceCommand } from "../domain/DeviceCommand";

export class LightingAdapter implements DeviceAdapter {
  async sendCommand(_command: DeviceCommand): Promise<void> {
    return;
  }
}
