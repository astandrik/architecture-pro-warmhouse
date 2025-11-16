import { v4 as uuidv4 } from "uuid";
import { Room } from "../domain/Room";

export class InMemoryStore {
  readonly rooms = new Map<string, Room>();
  constructor() {
    const houseId = uuidv4();
    const add = (name: string) => {
      const r = new Room(uuidv4(), houseId, name);
      this.rooms.set(r.id, r);
    };
    add("Living Room");
    add("Bedroom");
    add("Kitchen");
    add("Office");
    add("Outdoor");
  }
}
