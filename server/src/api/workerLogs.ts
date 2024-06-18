import express from "express"
import status from "http-status"
import { IMongoIdSchema, MongoIdSchema, validate as validateSchema } from "../schema"
import * as schema from "../schema/workerLogs"
import { WorkerLogs } from "../models"

export const router = express.Router()

router.post("/", validateSchema(schema.CreateWorkerLogSchema), async (req: schema.ICreateWorkerLogSchema, res, next) => {
	try {
		const workerLogs = new WorkerLogs({
			timeWorked: req.body.timeWorked,
			employeeID: req.body.employeeID,
		})
		await workerLogs.save()
		res.send({ message: "Successfully created worker log" })
	} catch (e) {
		next(e)
	}
})

router.get("/", async (req, res, next) => {
	try {
		const WorkerLog = await WorkerLogs.find()
		if (!WorkerLog) {
			return next({
				message: "Could not find worker logs",
				status: status.BAD_REQUEST,
			})
		}
		res.send({ workerLogs: WorkerLog, message: "message" })
	} catch (e) {
		next(e)
	}
})

router.get("/one/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
	try {
		if (!req.params.id) {
			return next({ message: "id is required", status: status.BAD_REQUEST })
		}
		const existingLog = await WorkerLogs.findOne({ _id: req.params.id })
		if (!existingLog) {
			return next({
				message: "Log(s) not found",
				status: status.BAD_REQUEST,
			})
		}

		res.send({ Logs: existingLog })
	} catch (e) {
		next(e)
	}
})

router.put("/:id", validateSchema(schema.CreateWorkerLogSchema), async (req: schema.ICreateWorkerLogSchema, res, next) => {
	try {
		const existingLog = await WorkerLogs.findOne({ _id: req.params.id })
		if (!existingLog) {
			return next({ message: "Worker Log does not exist", status: status.BAD_REQUEST })
		}
		await WorkerLogs.findOneAndUpdate(
			{
				_id: req.params.id,
			},
			{
				timeWorked: req.body.timeWorked,
				employeeID: req.body.employeeID,
			},
			{
				new: true,
			}
		)
		res.send({ message: "Worker Log updated successfully" })
	} catch (e) {
		next(e)
	}
})

router.delete("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
	try {
		if (!req.params.id) {
			return next({ message: "id is required", status: status.BAD_REQUEST })
		}
		await WorkerLogs.findByIdAndDelete({ _id: req.params.id })
		res.send({ message: "Successfully Deleted" })
	} catch (e) {
		next(e)
	}
})
