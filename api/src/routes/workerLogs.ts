import express from "express";
import status from "http-status";
import { validate as validateSchema} from "../schema";
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

router.get("/name", validateSchema(schema.CreateWorkerLogSchema), async (req: schema.ICreateWorkerLogSchema, res, next) => {
  try {
    if (!req.body.name) {
      return next({ message: "Name is required", status: status.BAD_REQUEST });
    }
    const existingLog = await WorkerLogs.findOne({ name: req.body.name });
    if (!existingLog) {
      return next({
        message: "Log not found",
        status: status.BAD_REQUEST
      });
    } 

    res.send({ account: existingLog });
  } catch (e) {
    next(e);
  }
});


router.get("/date", validateSchema(schema.CreateWorkerLogSchema), async (req: schema.ICreateWorkerLogSchema, res, next) => {
  try {
    if (!req.query.date) {
      return next({ message: "date  is required", status: status.BAD_REQUEST });
    }
    const existingLog = await WorkerLogs.findOne({ createdAt: req.query.date });
    if (!existingLog) {
      return next({
        message: "Log not found",
        status: status.BAD_REQUEST
      });
    }

    res.send({ account: existingLog });
  } catch (e) {
    next(e);
  }
});



