import express from "express";
import status from "http-status";
import { validate as validateSchema} from "../schema";
import * as schema from "../schema/workerLogs";
import { WorkerLogs } from "../models";

export const router = express.Router();

router.post("/:id", validateSchema(schema.CreateWorkerLogSchema), async (req: schema.ICreateWorkerLogSchema, res, next) => {
   try
   {
    const workerLogs = new WorkerLogs({
      employeeID: req.params.id,
      timeWorked: req.body.timeWorked,
      date: req.body.date,
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

router.get("/:id", validateSchema(schema.CreateWorkerLogSchema), async (req: schema.ICreateWorkerLogSchema, res, next) => {
  try {
    if (!req.params.id) {
      return next({ message: "id is required", status: status.BAD_REQUEST });
    }
    const existingLog = await WorkerLogs.findOne({ employeeID: req.params.id });
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
    if (!req.body.date) {
      return next({ message: "date  is required", status: status.BAD_REQUEST });
    }
    const existingLog = await WorkerLogs.find({ date: req.body.date });
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

router.get("/employee", validateSchema(schema.CreateWorkerLogSchema), async(req: schema.ICreateWorkerLogSchema, res, next) => {



}) 



