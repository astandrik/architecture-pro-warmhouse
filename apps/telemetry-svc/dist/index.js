"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InMemoryTelemetryRepository_1 = require("./repo/InMemoryTelemetryRepository");
const TelemetryProcessor_1 = require("./services/TelemetryProcessor");
const TelemetryQueryService_1 = require("./services/TelemetryQueryService");
const TelemetryController_1 = require("./http/TelemetryController");
const App_1 = require("./http/App");
const repo = new InMemoryTelemetryRepository_1.InMemoryTelemetryRepository();
const processor = new TelemetryProcessor_1.TelemetryProcessor(repo);
const query = new TelemetryQueryService_1.TelemetryQueryService(repo);
const controller = new TelemetryController_1.TelemetryController(processor, query);
const application = new App_1.App(controller);
const port = Number(process.env.PORT || 8091);
application.app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`telemetry-svc listening on :${port}`);
});
