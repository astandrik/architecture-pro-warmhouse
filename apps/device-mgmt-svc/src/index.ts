import { InMemoryCommandRepository } from "./repo/InMemoryCommandRepository";
import { HeatingAdapter } from "./adapters/HeatingAdapter";
import { LightingAdapter } from "./adapters/LightingAdapter";
import { GateAdapter } from "./adapters/GateAdapter";
import { SurveillanceAdapter } from "./adapters/SurveillanceAdapter";
import { DeviceAdapterRouter } from "./adapters/DeviceAdapterRouter";
import { AccessPolicy } from "./policy/AccessPolicy";
import { DeviceRegistryClient } from "./integrations/DeviceRegistryClient";
import { DeviceCommandService } from "./services/DeviceCommandService";
import { DeviceCommandController } from "./http/DeviceCommandController";
import { App } from "./http/App";

const repo = new InMemoryCommandRepository();
const router = new DeviceAdapterRouter({
  heating: new HeatingAdapter(),
  lighting: new LightingAdapter(),
  gate: new GateAdapter(),
  surveillance: new SurveillanceAdapter(),
});
const policy = new AccessPolicy();
const registry = new DeviceRegistryClient();
const svc = new DeviceCommandService(repo, router, policy, registry);
const controller = new DeviceCommandController(svc);
const application = new App(controller);

const port = Number(process.env.PORT || 8092);
application.app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`device-mgmt-svc listening on :${port}`);
});
