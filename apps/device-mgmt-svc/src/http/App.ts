import express from "express";
import { DeviceCommandController } from "./DeviceCommandController";

export class App {
  readonly app = express();
  constructor(controller: DeviceCommandController) {
    this.app.use(express.json());
    this.app.use(controller.router);
  }
}
