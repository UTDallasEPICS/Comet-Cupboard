"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router")); // implementing this
const port = 8000;
const app = (0, express_1.default)();
app.use("/", (0, router_1.default)());
app.listen(port, () => {
    console.log(`Server started and listening on port ${port}`);
});