"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceCommandController = void 0;
const express_1 = __importDefault(require("express"));
class DeviceCommandController {
    constructor(svc) {
        this.svc = svc;
        this.router = express_1.default.Router();
        this.create = async (req, res) => {
            try {
                const result = await this.svc.createCommand({
                    device_id: req.body?.device_id,
                    command_type: req.body?.command_type,
                    payload: req.body?.payload,
                    scenario_id: req.body?.scenario_id,
                    user_id: req.body?.user_id,
                });
                res.status(202).json({ command_id: result.commandId, status: result.status });
            }
            catch (e) {
                const msg = String(e?.message || "error");
                if (msg === "forbidden") {
                    res.status(403).json({ code: "FORBIDDEN", message: msg });
                    return;
                }
                if (msg === "device not found") {
                    res.status(404).json({ code: "NOT_FOUND", message: msg });
                    return;
                }
                res.status(400).json({ code: "BAD_REQUEST", message: msg });
            }
        };
        this.get = async (req, res) => {
            const id = String(req.params.id || "");
            const cmd = await this.svc.getById(id);
            if (!cmd) {
                res.status(404).json({ code: "NOT_FOUND", message: "command not found" });
                return;
            }
            res.status(200).json(cmd);
        };
        this.router.post("/v1/device-commands", this.create);
        this.router.get("/v1/device-commands/:id", this.get);
        this.router.get("/health", (_req, res) => res.status(200).send("OK"));
    }
}
exports.DeviceCommandController = DeviceCommandController;
