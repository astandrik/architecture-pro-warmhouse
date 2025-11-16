import express from "express";
import { InMemoryStore } from "./repo/InMemoryStore";
import { Controller } from "./http/Controller";

const store = new InMemoryStore();
const controller = new Controller(store);
const app = express();
app.use(express.json());
app.use(controller.router);

const port = Number(process.env.PORT || 8094);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`user-houses-svc listening on :${port}`);
});
