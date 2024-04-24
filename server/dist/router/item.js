"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const item_1 = require("../services/item");
exports.default = (router) => {
    //"Does the request match any of these?"
    router.post("/item/get", item_1.getAllItems);
    router.post("/item/getCategory", item_1.getOnlyCategory);
};
