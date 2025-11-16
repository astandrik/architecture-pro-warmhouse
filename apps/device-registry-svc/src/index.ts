import express from "express";
import { RegistryController } from "./http/RegistryController";

const controller = new RegistryController();
const app = express();
app.use(express.json());
app.use(controller.router);

const port = Number(process.env.PORT || 8093);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`device-registry-svc listening on :${port}`);
});
