"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceAdapterRouter = void 0;
class DeviceAdapterRouter {
    constructor(adapters) {
        this.adapters = adapters;
    }
    route(command) {
        // Simple routing by commandType prefix: HEATING_, LIGHT_, GATE_, SURV_
        if (command.commandType.startsWith("HEATING_"))
            return this.adapters["heating"];
        if (command.commandType.startsWith("LIGHT_"))
            return this.adapters["lighting"];
        if (command.commandType.startsWith("GATE_"))
            return this.adapters["gate"];
        if (command.commandType.startsWith("SURV_"))
            return this.adapters["surveillance"];
        // default to heating for MVP
        return this.adapters["heating"];
    }
}
exports.DeviceAdapterRouter = DeviceAdapterRouter;
