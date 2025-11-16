import express from "express";
import { TelemetryProcessor } from "../services/TelemetryProcessor";
import { TelemetryQueryService } from "../services/TelemetryQueryService";

export class TelemetryController {
  readonly router = express.Router();
  constructor(
    private readonly processor: TelemetryProcessor,
    private readonly query: TelemetryQueryService
  ) {
    this.router.post("/v1/telemetry", this.ingest);
    this.router.get("/v1/telemetry", this.get);
    this.router.get("/health", (_req, res) => res.status(200).send("OK"));
  }

  private ingest = async (req: express.Request, res: express.Response) => {
    try {
      await this.processor.ingest(req.body);
      res.status(202).json({ status: "queued" });
    } catch (e: any) {
      res
        .status(400)
        .json({
          code: "BAD_REQUEST",
          message: e?.message ?? "invalid payload",
        });
    }
  };

  private get = async (req: express.Request, res: express.Response) => {
    const deviceId = String(req.query.device_id || "");
    const limit = Number(req.query.limit || 50);
    if (!deviceId) {
      res
        .status(400)
        .json({ code: "BAD_REQUEST", message: "device_id is required" });
      return;
    }
    const items = await this.query.get(
      deviceId,
      Math.min(Math.max(limit, 1), 1000)
    );
    res.status(200).json(items);
  };
}
