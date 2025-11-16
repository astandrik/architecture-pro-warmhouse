import { InMemoryTelemetryRepository } from "./repo/InMemoryTelemetryRepository";
import { TelemetryProcessor } from "./services/TelemetryProcessor";
import { TelemetryQueryService } from "./services/TelemetryQueryService";
import { TelemetryController } from "./http/TelemetryController";
import { App } from "./http/App";

const repo = new InMemoryTelemetryRepository();
const processor = new TelemetryProcessor(repo);
const query = new TelemetryQueryService(repo);
const controller = new TelemetryController(processor, query);
const application = new App(controller);

const port = Number(process.env.PORT || 8091);
application.app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`telemetry-svc listening on :${port}`);
});


