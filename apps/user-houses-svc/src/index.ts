import express from "express";
import { Controller } from "./http/Controller";

const controller = new Controller();
const app = express();
app.use(express.json());
app.use(controller.router);

const port = Number(process.env.PORT || 8094);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`user-houses-svc listening on :${port}`);
});
