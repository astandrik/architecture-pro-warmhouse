import { v4 as uuidv4 } from "uuid";
import {
  Device,
  DeviceType,
  Module,
  ModuleType,
  Room,
} from "../domain/Entities";

export class InMemoryStore {
  readonly deviceTypes = new Map<string, DeviceType>();
  readonly devices = new Map<string, Device>();
  readonly rooms = new Map<string, Room>();
  readonly modules = new Map<string, Module>();
  readonly moduleTypes = new Map<string, ModuleType>();

  constructor() {
    // Seed device types
    const dt = (
      code: string,
      name: string,
      category: "sensor" | "actuator"
    ) => {
      const id = uuidv4();
      const t = new DeviceType(id, code, name, category);
      this.deviceTypes.set(id, t);
      return t;
    };
    const temp = dt("TEMP_SENSOR", "Temperature Sensor", "sensor");
    dt("HEATING", "Heating Actuator", "actuator");
    dt("LIGHT", "Light Actuator", "actuator");
    dt("GATE", "Gate Actuator", "actuator");
    dt("CAMERA", "Camera", "sensor");

    // Seed rooms/modules/moduleTypes
    const mtId = uuidv4();
    this.moduleTypes.set(
      mtId,
      new ModuleType(mtId, "HEATING_KIT", "Heating Kit")
    );
    const houseId = uuidv4();
    const living = new Room(uuidv4(), houseId, "Living Room");
    const bedroom = new Room(uuidv4(), houseId, "Bedroom");
    const kitchen = new Room(uuidv4(), houseId, "Kitchen");
    this.rooms.set(living.id, living);
    this.rooms.set(bedroom.id, bedroom);
    this.rooms.set(kitchen.id, kitchen);
    const mod = new Module(uuidv4(), mtId, houseId, "Boiler room kit");
    this.modules.set(mod.id, mod);

    // Seed 3 temperature devices, IDs matching 1,2,3 for monolith mapping
    const seedDevice = (idHint: string, room: Room, serial: string) => {
      const d = new Device(
        idHint,
        temp.id,
        mod.id,
        room.id,
        serial,
        "online",
        "IDLE",
        new Date()
      );
      this.devices.set(d.id, d);
    };
    seedDevice("1", living, "SN-THERMO-001");
    seedDevice("2", bedroom, "SN-THERMO-002");
    seedDevice("3", kitchen, "SN-THERMO-003");
  }
}
