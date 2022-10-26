import express from "express";
//import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/workerLogs";
//import { WorkerLogs } from "../models";

export const router = express.Router();

router.post("/", validateSchema(schema.CreateWorkerLogSchema), async (req: schema.ICreateWorkerLogSchema, res, next) => {
    res.status(501).send({message: "NOT_IMPLEMENTED"});
});


router.get("/", async (req, res, next) => {
    res.status(501).send({message: "NOT_IMPLEMENTED"});
});

