import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/checkoutLog";
import { CheckoutLog } from "../models";

export const router = express.Router();

router.post("/", validateSchema(schema.CreateCheckoutLogSchema), async (req: schema.ICreateCheckoutLogSchema, res, next) => {
    try {
        const newcheckoutLog = new CheckoutLog({
            recipientID: req.body.recipientID,
            workerID: req.body.workerID,
            dateOfCheckout: req.body.dateOfCheckout
        });
        await newcheckoutLog.save();
        res.send({ message: "Succesfully created checkout log"});
    } catch(e) {
        next(e);
    }
});

router.get("/", async (req, res, next) => {
    try{
        const existingCheckoutLog = await CheckoutLog.find();
        res.send({ logs: existingCheckoutLog});
    } catch (e) {
        next(e);
    }
});

router.get("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
    try {
        if(!req.params.id){
            return next({ message: "ID is required", status: status.BAD_REQUEST });
        }
        const eCheckoutLog = await CheckoutLog.findOne({ _id: req.params.id });
        if(!eCheckoutLog) {
            return next ({
                message: "Checkout Log does not exist",
                status: status.BAD_REQUEST
            });
        }
        res.send({ CheckoutLog: eCheckoutLog });
    } catch(e) {
        next(e);
    }
});

router.delete("/:id", validateSchema(MongoIdSchema), async ( req: IMongoIdSchema, res, next) => {
    try {
        if(!req.params.id){
            return next({ message: "Id is required", status: status.BAD_REQUEST });
        }
        await CheckoutLog.deleteOne({ _id: req.params.id});

        res.send({ message: "Succesfully deleted account"});
    } catch(e) {
        next(e);
    }
});

router.put("/:id", validateSchema(schema.CreateCheckoutLogSchema), async(req: schema.ICreateCheckoutLogSchema, res, next) => {
    try{
        const eCheckoutLog = await CheckoutLog.findOne({ _id: req.params.id});
        if(!eCheckoutLog){
            return next({
                message: "Form does not exist",
                status: status.BAD_REQUEST
            });
        }
        await CheckoutLog.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                recipientID: req.body.recipientID,
                workerID: req.body.workerID,
                dateOfCheckout: req.body.dateOfCheckout
            },
            {
                new: true
            }
        );
    res.send({ message: "CheckoutLog Updated"})
    } catch(e){
        next(e);
    }
});