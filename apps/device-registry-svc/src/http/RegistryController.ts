import express from "express";
import { v4 as uuidv4 } from "uuid";
import { InMemoryStore } from "../repo/InMemoryStore";

export class RegistryController {
  readonly router = express.Router();
  private readonly userHousesUrl: string;
  constructor(private readonly store: InMemoryStore) {
    this.userHousesUrl =
      process.env.USER_HOUSES_URL || "http://user-houses:8094";
    this.router.get("/health", (_req, res) => res.status(200).send("OK"));
    this.router.get("/v1/device-types", this.getDeviceTypes);
    this.router.get("/v1/devices", this.listDevices);
    this.router.get("/v1/devices/:id", this.getDevice);
    this.router.post("/v1/devices", this.createDevice);
    this.router.delete("/v1/devices/:id", this.deleteDevice);
  }

  private getDeviceTypes = (_req: express.Request, res: express.Response) => {
    res.status(200).json(Array.from(this.store.deviceTypes.values()));
  };

  private listDevices = (req: express.Request, res: express.Response) => {
    const typeCode = String(req.query.type_code || "");
    const all = Array.from(this.store.devices.values());
    if (!typeCode) {
      res.status(200).json(this.toDtos(all));
      return;
    }
    const typesById = new Map(
      Array.from(this.store.deviceTypes.values()).map((t) => [t.id, t])
    );
    const filtered = all.filter(
      (d) => typesById.get(d.deviceTypeId)?.code === typeCode
    );
    res.status(200).json(this.toDtos(filtered));
  };

  private getDevice = (req: express.Request, res: express.Response) => {
    const id = String(req.params.id);
    const d = this.store.devices.get(id);
    if (!d) {
      res.status(404).json({ code: "NOT_FOUND", message: "device not found" });
      return;
    }
    res.status(200).json(this.toDto(d));
  };

  private createDevice = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { device_type_code, room_id, module_id, serial_number } =
      req.body || {};
    if (!device_type_code || !room_id) {
      res.status(400).json({
        code: "BAD_REQUEST",
        message: "device_type_code and room_id are required",
      });
      return;
    }
    const dt = Array.from(this.store.deviceTypes.values()).find(
      (t) => t.code === device_type_code
    );
    if (!dt) {
      res
        .status(400)
        .json({ code: "BAD_REQUEST", message: "unknown device_type_code" });
      return;
    }
    const exists = await this.roomExists(String(room_id));
    if (!exists) {
      res.status(400).json({ code: "BAD_REQUEST", message: "unknown room_id" });
      return;
    }
    const modId =
      module_id && this.store.modules.has(module_id)
        ? module_id
        : Array.from(this.store.modules.keys())[0];
    const id = uuidv4();
    this.store.devices.set(id, {
      id,
      deviceTypeId: dt.id,
      moduleId: modId,
      roomId: String(room_id),
      serialNumber: serial_number || `SN-${id.slice(0, 8).toUpperCase()}`,
      connectionStatus: "online",
      operationalState: "IDLE",
      lastSeenAt: new Date(),
    });
    res.status(201).json({ id });
  };

  private deleteDevice = (req: express.Request, res: express.Response) => {
    const id = String(req.params.id);
    if (!this.store.devices.has(id)) {
      res.status(404).json({ code: "NOT_FOUND", message: "device not found" });
      return;
    }
    this.store.devices.delete(id);
    res.status(200).json({ message: "deleted" });
  };

  private toDtos(devices: any[]): any[] {
    return devices.map((d) => this.toDto(d));
  }
  private toDto(d: any): any {
    return {
      id: d.id,
      device_type_id: d.deviceTypeId,
      module_id: d.moduleId,
      room_id: d.roomId,
      serial_number: d.serialNumber,
      connection_status: d.connectionStatus,
      operational_state: d.operationalState,
      last_seen_at: d.lastSeenAt?.toISOString?.() ?? null,
    };
  }

  private async roomExists(roomId: string): Promise<boolean> {
    try {
      const resp = await fetch(`${this.userHousesUrl}/v1/rooms`);
      if (!resp.ok) return false;
      const rooms = await resp.json();
      return (
        Array.isArray(rooms) && rooms.some((r: any) => String(r.id) === roomId)
      );
    } catch {
      return false;
    }
  }
}
