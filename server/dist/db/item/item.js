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
exports.updateItem = exports.deleteItem = exports.addNewItem = exports.getItemsByCategory = exports.getItems = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getItems = () => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield prisma.item.findMany();
    return items;
});
exports.getItems = getItems;
const getItemsByCategory = (classification) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield prisma.item.findMany({
        where: {
            classification,
        },
    });
    return item;
});
exports.getItemsByCategory = getItemsByCategory;
const addNewItem = () => __awaiter(void 0, void 0, void 0, function* () {
});
exports.addNewItem = addNewItem;
const deleteItem = () => __awaiter(void 0, void 0, void 0, function* () {
});
exports.deleteItem = deleteItem;
const updateItem = () => __awaiter(void 0, void 0, void 0, function* () {
});
exports.updateItem = updateItem;
