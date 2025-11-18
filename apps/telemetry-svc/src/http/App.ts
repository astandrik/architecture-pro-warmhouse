import express from "express";
import { TelemetryController } from "./TelemetryController";

export class App {
  readonly app = express();
  constructor(controller: TelemetryController) {
    this.app.use(express.json());
    this.app.use(controller.router);
  }
}
