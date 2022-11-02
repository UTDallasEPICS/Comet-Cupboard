import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema/*, IMongoIdSchema*/ } from "../schema";
import * as schema from "../schema/workerLogs";
import { WorkerLogs } from "../models";

export const router = express.Router();

router.post("/", validateSchema(schema.CreateWorkerLogSchema), async (req: schema.ICreateWorkerLogSchema, res, next) => {
   try
   {
    const workerLogs = new WorkerLogs({
      ...req.body
    });
    await workerLogs.save();
    res.send({message: "ha swag"});
   }
   catch(e)
   {
    next(e);
   }
  
});


router.get("/", async (req, res, next) => {
    try {
        const WorkerLog = await WorkerLogs.find();
        res.send({ accounts: WorkerLog });
      } catch (e) {
        next(e);
      }
});

router.delete("/:id", validateSchema(MongoIdSchema), async (req, res, next) => {
    try {
      if (!req.params.id) {
        return next({ message: "Id is required", status: status.BAD_REQUEST });
      }
      await WorkerLogs.deleteOne({ _id: req.params.id });
  
      res.send({ message: "Successfully deleted account" });
    } catch (e) {
      next(e);
    }
  });

