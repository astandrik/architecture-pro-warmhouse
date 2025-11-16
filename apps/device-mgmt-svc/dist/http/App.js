"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
class App {
    constructor(controller) {
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use(controller.router);
    }
}
exports.App = App;
