import express from "express";
import { InMemoryStore } from "../repo/InMemoryStore";

export class Controller {
  readonly router = express.Router();
  constructor(private readonly store: InMemoryStore) {
    this.router.get("/health", (_req, res) => res.status(200).send("OK"));
    this.router.get("/v1/rooms", this.listRooms);
  }
  private listRooms = (_req: express.Request, res: express.Response) => {
    res.status(200).json(Array.from(this.store.rooms.values()));
  };
}
