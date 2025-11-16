"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryController = void 0;
const express_1 = __importDefault(require("express"));
class TelemetryController {
    constructor(processor, query) {
        this.processor = processor;
        this.query = query;
        this.router = express_1.default.Router();
        this.ingest = async (req, res) => {
            try {
                await this.processor.ingest(req.body);
                res.status(202).json({ status: "queued" });
            }
            catch (e) {
                res
                    .status(400)
                    .json({
                    code: "BAD_REQUEST",
                    message: e?.message ?? "invalid payload",
                });
            }
        };
        this.get = async (req, res) => {
            const deviceId = String(req.query.device_id || "");
            const limit = Number(req.query.limit || 50);
            if (!deviceId) {
                res
                    .status(400)
                    .json({ code: "BAD_REQUEST", message: "device_id is required" });
                return;
            }
            const items = await this.query.get(deviceId, Math.min(Math.max(limit, 1), 1000));
            res.status(200).json(items);
        };
        this.router.post("/v1/telemetry", this.ingest);
        this.router.get("/v1/telemetry", this.get);
        this.router.get("/health", (_req, res) => res.status(200).send("OK"));
    }
}
exports.TelemetryController = TelemetryController;
