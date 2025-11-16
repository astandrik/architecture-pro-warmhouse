import express from "express";
import { v4 as uuidv4 } from "uuid";
import { Pool } from "pg";

export class RegistryController {
  readonly router = express.Router();
  private readonly userHousesUrl: string;
  private readonly pool: Pool;
  constructor() {
    this.userHousesUrl =
      process.env.USER_HOUSES_URL || "http://user-houses:8094";
    const dbUrl = process.env.DEVICE_REGISTRY_DB_URL;
    if (!dbUrl) {
      throw new Error("DEVICE_REGISTRY_DB_URL is required");
    }
    this.pool = new Pool({ connectionString: dbUrl, max: 5 });
    this.router.get("/health", (_req, res) => res.status(200).send("OK"));
    this.router.get("/v1/device-types", this.getDeviceTypes);
    this.router.get("/v1/devices", this.listDevices);
    this.router.get("/v1/devices/:id", this.getDevice);
    this.router.post("/v1/devices", this.createDevice);
    this.router.delete("/v1/devices/:id", this.deleteDevice);
  }

  private getDeviceTypes = async (
    _req: express.Request,
    res: express.Response
  ) => {
    try {
      const { rows } = await this.pool.query(
        "SELECT id::text, code, name, category FROM device_types ORDER BY name"
      );
      res.status(200).json(rows);
    } catch (e) {
      res.status(500).json({ code: "DB_ERROR", message: String(e) });
    }
  };

  private listDevices = async (req: express.Request, res: express.Response) => {
    const typeCode = String(req.query.type_code || "");
    try {
      if (!typeCode) {
        const { rows } = await this.pool.query(
          "SELECT d.id, d.device_type_id::text, d.module_id::text, d.room_id::text, d.serial_number, d.connection_status, d.operational_state, d.last_seen_at FROM devices d ORDER BY d.id"
        );
        res.status(200).json(rows.map(this.rowToDto));
        return;
      }
      const { rows } = await this.pool.query(
        `SELECT d.id, d.device_type_id::text, d.module_id::text, d.room_id::text, d.serial_number, d.connection_status, d.operational_state, d.last_seen_at
         FROM devices d
         JOIN device_types t ON t.id=d.device_type_id
         WHERE t.code = $1
         ORDER BY d.id`,
        [typeCode]
      );
      res.status(200).json(rows.map(this.rowToDto));
    } catch (e) {
      res.status(500).json({ code: "DB_ERROR", message: String(e) });
    }
  };

  private getDevice = async (req: express.Request, res: express.Response) => {
    const id = String(req.params.id);
    try {
      const { rows } = await this.pool.query(
        "SELECT id, device_type_id::text, module_id::text, room_id::text, serial_number, connection_status, operational_state, last_seen_at FROM devices WHERE id=$1",
        [id]
      );
      if (rows.length === 0) {
        res
          .status(404)
          .json({ code: "NOT_FOUND", message: "device not found" });
        return;
      }
      res.status(200).json(this.rowToDto(rows[0]));
    } catch (e) {
      res.status(500).json({ code: "DB_ERROR", message: String(e) });
    }
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
    try {
      const dt = await this.pool.query(
        "SELECT id FROM device_types WHERE code=$1",
        [device_type_code]
      );
      if (dt.rowCount === 0) {
        res
          .status(400)
          .json({ code: "BAD_REQUEST", message: "unknown device_type_code" });
        return;
      }
      const exists = await this.roomExists(String(room_id));
      if (!exists) {
        res
          .status(400)
          .json({ code: "BAD_REQUEST", message: "unknown room_id" });
        return;
      }
      let modId = module_id as string | null;
      if (modId) {
        const modCheck = await this.pool.query(
          "SELECT 1 FROM modules WHERE id=$1",
          [modId]
        );
        if (modCheck.rowCount === 0) {
          modId = null;
        }
      }
      if (!modId) {
        const m = await this.pool.query("SELECT id::text FROM modules LIMIT 1");
        if (m.rowCount === 0) {
          res
            .status(500)
            .json({ code: "DB_ERROR", message: "no modules available" });
          return;
        }
        modId = m.rows[0].id;
      }
      const id = uuidv4();
      await this.pool.query(
        `INSERT INTO devices (id, device_type_id, module_id, room_id, serial_number, connection_status, operational_state, last_seen_at)
         VALUES ($1, $2, $3, $4, $5, 'online', 'IDLE', now())`,
        [
          id,
          dt.rows[0].id,
          modId,
          String(room_id),
          serial_number || `SN-${id.slice(0, 8).toUpperCase()}`,
        ]
      );
      res.status(201).json({ id });
    } catch (e) {
      res.status(500).json({ code: "DB_ERROR", message: String(e) });
    }
  };

  private deleteDevice = async (
    req: express.Request,
    res: express.Response
  ) => {
    const id = String(req.params.id);
    try {
      const r = await this.pool.query("DELETE FROM devices WHERE id=$1", [id]);
      if (r.rowCount === 0) {
        res
          .status(404)
          .json({ code: "NOT_FOUND", message: "device not found" });
        return;
      }
      res.status(200).json({ message: "deleted" });
    } catch (e) {
      res.status(500).json({ code: "DB_ERROR", message: String(e) });
    }
  };

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

  private rowToDto = (r: any) => ({
    id: String(r.id),
    device_type_id: String(r.device_type_id),
    module_id: String(r.module_id),
    room_id: String(r.room_id),
    serial_number: String(r.serial_number),
    connection_status: String(r.connection_status),
    operational_state: String(r.operational_state),
    last_seen_at: r.last_seen_at
      ? new Date(r.last_seen_at).toISOString()
      : null,
  });
}
