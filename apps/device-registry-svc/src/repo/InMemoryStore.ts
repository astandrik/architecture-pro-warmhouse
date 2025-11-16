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
    // Seed device and module types only
    const seedType = (
      code: string,
      name: string,
      category: "sensor" | "actuator"
    ) => {
      const id = uuidv4();
      const t = new DeviceType(id, code, name, category);
      this.deviceTypes.set(id, t);
      return t;
    };
    seedType("TEMP_SENSOR", "Temperature Sensor", "sensor");
    seedType("HEATING", "Heating Actuator", "actuator");
    seedType("LIGHT", "Light Actuator", "actuator");
    seedType("GATE", "Gate Actuator", "actuator");
    seedType("CAMERA", "Camera", "sensor");

    const mtId = uuidv4();
    this.moduleTypes.set(
      mtId,
      new ModuleType(mtId, "HEATING_KIT", "Heating Kit")
    );
  }

  seedDevicesForRooms(rooms: Room[]) {
    // Create one module bound to the first room's house (or random)
    const mt = Array.from(this.moduleTypes.values())[0];
    const houseId = rooms.length > 0 ? rooms[0].houseId : uuidv4();
    const mod = new Module(uuidv4(), mt.id, houseId, "Default kit");
    this.modules.set(mod.id, mod);

    // Map well-known room names to fixed device ids for TEMP_SENSOR mapping
    const nameToId: Record<string, string> = {
      "Living Room": "1",
      Bedroom: "2",
      Kitchen: "3",
    };
    const tempType = Array.from(this.deviceTypes.values()).find(
      (t) => t.code === "TEMP_SENSOR"
    );
    if (!tempType) return;
    for (const r of rooms) {
      this.rooms.set(r.id, r);
      const idHint = nameToId[r.name];
      if (!idHint) continue;
      const d = new Device(
        idHint,
        tempType.id,
        mod.id,
        r.id,
        `SN-THERMO-${idHint.padStart(3, "0")}`,
        "online",
        "IDLE",
        new Date()
      );
      this.devices.set(d.id, d);
    }
  }
}
