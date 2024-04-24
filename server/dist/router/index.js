"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const item_1 = __importDefault(require("./item"));
const router = express_1.default.Router();
exports.default = () => {
    //Order of routing
    (0, item_1.default)(router);
    return router;
};
