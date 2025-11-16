export type DeviceCategory = "actuator" | "sensor";

export class DeviceType {
  constructor(
    public readonly id: string,
    public readonly code: string, // HEATING, LIGHT, GATE, CAMERA, TEMP_SENSOR
    public readonly name: string,
    public readonly category: DeviceCategory
  ) {}
}

export class ModuleType {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string
  ) {}
}

export class Room {
  constructor(
    public readonly id: string,
    public readonly houseId: string,
    public readonly name: string
  ) {}
}

export class Module {
  constructor(
    public readonly id: string,
    public readonly moduleTypeId: string,
    public readonly houseId: string,
    public readonly name: string
  ) {}
}

export class Device {
  constructor(
    public readonly id: string,
    public readonly deviceTypeId: string,
    public readonly moduleId: string,
    public readonly roomId: string,
    public readonly serialNumber: string,
    public connectionStatus: "online" | "offline",
    public operationalState: string,
    public lastSeenAt?: Date
  ) {}
}
