import express from "express";
import status from "http-status";
import { IMongoIdSchema, MongoIdSchema, validate as validateSchema} from "../schema";
import * as schema from "../schema/workerLogs";
import { WorkerLogs } from "../models";

export const router = express.Router();

router.post("/:id", validateSchema(schema.CreateWorkerLogSchema), async (req: schema.ICreateWorkerLogSchema, res, next) => {
   try
   {
    const workerLogs = new WorkerLogs({
      employeeID: req.params.id,
      timeWorked: req.body.timeWorked,
     
    });
    await workerLogs.save();
    res.send({message: "Successfully created worker log"});
   }
   catch(e)
   {
    next(e);
   }
  
});


router.get("/", async (req, res, next) => {
    try {
        const WorkerLog = await WorkerLogs.find();
        if(!WorkerLog) {
          return next({
            message: "Could not find worker logs",
            status: status.BAD_REQUEST
          });
        }
        res.send({ workerLogs: WorkerLog });
      } catch (e) {
        next(e);
      }
});

router.get("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
  try {
    if (!req.params.id) {
      return next({ message: "id is required", status: status.BAD_REQUEST });
    }
    const existingLog = await WorkerLogs.find({ employeeID: req.params.id });
    if (!existingLog) {
      return next({
        message: "Log(s) not found",
        status: status.BAD_REQUEST
      });
    } 
    

    res.send({ workerLog: existingLog });
  } catch (e) {
    next(e);
  }
});








