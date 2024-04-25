"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnlyCategory = exports.getAllItems = void 0;
const item_1 = require("../db/item/item");
const getAllItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const details = yield (0, item_1.getItems)();
    return res.status(200).json(details).end();
});
exports.getAllItems = getAllItems;
const getOnlyCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.body;
    const details = yield (0, item_1.getItemsByCategory)(category);
    return res.status(200).json(details).end();
});
exports.getOnlyCategory = getOnlyCategory;
