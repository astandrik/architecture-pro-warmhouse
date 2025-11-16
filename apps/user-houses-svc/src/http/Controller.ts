import express from "express";
import { Pool } from "pg";

export class Controller {
  readonly router = express.Router();
  private readonly pool: Pool | null = null;
  constructor() {
    const dbUrl = process.env.USER_HOUSES_DB_URL;
    if (!dbUrl) {
      throw new Error("USER_HOUSES_DB_URL is required");
    }
    this.pool = new Pool({ connectionString: dbUrl, max: 5 });
    this.router.get("/health", (_req, res) => res.status(200).send("OK"));
    this.router.get("/v1/rooms", this.listRooms);
  }
  private listRooms = async (_req: express.Request, res: express.Response) => {
    if (this.pool !== null) {
      try {
        const { rows } = await this.pool.query(
          "SELECT id::text, house_id::text, name FROM rooms ORDER BY name"
        );
        res
          .status(200)
          .json(
            rows.map((r) => ({ id: r.id, houseId: r.house_id, name: r.name }))
          );
        return;
      } catch (e) {
        res.status(500).json({ code: "DB_ERROR", message: String(e) });
        return;
      }
    }
    res.status(500).json({ code: "DB_ERROR", message: "no DB connection" });
  };
}
