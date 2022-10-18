import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/item";
import { Item } from "../models";

export const router = express.Router();

router.post("/", validateSchema(schema.CreateItemSchema), async (req: schema.ICreateItemSchema, res, next) => {
    res.status(501).send({message: "NOT_IMPLEMENTED"});
});

router.put("/:id", validateSchema(MongoIdSchema), async(req: IMongoIdSchema, res, next) => {
    res.status(501).send({message: "NOT_IMPLEMENTED"});
});

router.get("/", async (req, res, next) => {
    res.status(501).send({message: "NOT_IMPLEMENTED"});
});

router.get("/:id", validateSchema(MongoIdSchema), async(req: IMongoIdSchema, res, next) => {
    res.status(501).send({message: "NOT_IMPLEMENTED"});
});