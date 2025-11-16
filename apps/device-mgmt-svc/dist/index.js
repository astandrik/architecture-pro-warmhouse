"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InMemoryCommandRepository_1 = require("./repo/InMemoryCommandRepository");
const HeatingAdapter_1 = require("./adapters/HeatingAdapter");
const LightingAdapter_1 = require("./adapters/LightingAdapter");
const GateAdapter_1 = require("./adapters/GateAdapter");
const SurveillanceAdapter_1 = require("./adapters/SurveillanceAdapter");
const DeviceAdapterRouter_1 = require("./adapters/DeviceAdapterRouter");
const AccessPolicy_1 = require("./policy/AccessPolicy");
const DeviceRegistryClient_1 = require("./integrations/DeviceRegistryClient");
const DeviceCommandService_1 = require("./services/DeviceCommandService");
const DeviceCommandController_1 = require("./http/DeviceCommandController");
const App_1 = require("./http/App");
const repo = new InMemoryCommandRepository_1.InMemoryCommandRepository();
const router = new DeviceAdapterRouter_1.DeviceAdapterRouter({
    heating: new HeatingAdapter_1.HeatingAdapter(),
    lighting: new LightingAdapter_1.LightingAdapter(),
    gate: new GateAdapter_1.GateAdapter(),
    surveillance: new SurveillanceAdapter_1.SurveillanceAdapter(),
});
const policy = new AccessPolicy_1.AccessPolicy();
const registry = new DeviceRegistryClient_1.DeviceRegistryClient();
const svc = new DeviceCommandService_1.DeviceCommandService(repo, router, policy, registry);
const controller = new DeviceCommandController_1.DeviceCommandController(svc);
const application = new App_1.App(controller);
const port = Number(process.env.PORT || 8092);
application.app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`device-mgmt-svc listening on :${port}`);
});
