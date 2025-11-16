"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCommandRepository = void 0;
class InMemoryCommandRepository {
    constructor() {
        this.map = new Map();
    }
    async save(command) {
        this.map.set(command.id, command);
    }
    async findById(id) {
        return this.map.get(id);
    }
}
exports.InMemoryCommandRepository = InMemoryCommandRepository;
