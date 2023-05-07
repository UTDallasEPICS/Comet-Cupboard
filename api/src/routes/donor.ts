import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/donor";
import { Donor } from "../models";

export const router = express.Router();

//Create New Donor
router.post("/", validateSchema(schema.CreateDonorSchema), async (req: schema.ICreateDonorSchema, res, next) => {
    try{
        const exisitingDonor = await Donor.findOne({ name: req.body.name });
        if(exisitingDonor){
            return next ({
                message: "Donor already exist",
                status: status.BAD_REQUEST
            });
        }
        const donor = new Donor({
            name: req.body.name,
            email: req.body.email,
            quantity: req.body.quantity
        });
        await donor.save();
        res.send({ message: "Donor Created Succesfully!" });
    }
    catch(e){
        next(e);
    }
});

//Get all donors
router.get("/", async (req, res, next) => {
    try{
        const Donors = await Donor.find();
        res.send({ Donators: Donors});
    } catch (e) {
        next(e);
    }
});

//Get Specific Donor 
router.get("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
    try{
        if(!req.params.id){
            return next({ message: "Id is required", })
        }
        const existingDonor = await Donor.findOne({_id: req.params.id });
        if(!existingDonor) {
            return next ({
                message: "Account not found",
                status: status.BAD_REQUEST
            });
        }

        res.send({ account: existingDonor });
    } catch (e) {
        next(e);
    }
});

//delete one account
router.delete("/:id", validateSchema(MongoIdSchema), async (req, res, next) => {
    try {
        if(!req.params.id) {
            return next ({
                message: "Id is required",
                status: status.BAD_REQUEST
            });
        }
        await Donor.deleteOne({ _id: req.params.id });
        res.send({
            message: "Deleted Succesfully"
        });
    } catch (e) {
        next(e);
    }
});

//update existing donor
//just updates quantity, does not check if total quantity goes below 0
router.put("/", validateSchema(schema.CreateDonorSchema), async (req: schema.ICreateDonorSchema, res, next) => {
    try{
        const donor = await Donor.findOne({ name: req.body.name });
        if(!donor){
            return next({
                message: "Donor does not exist",
                status: status.BAD_REQUEST
            });
        }
        let prevQuantity = donor.quantity + req.body.quantity;
        await Donor.findOneAndUpdate(
            {
            name: req.body.name
        },
        {
            quantity: prevQuantity,
            email: donor.email,
            name: donor.name
        },
        {
            new: true
        });
        res.send({
            message: "Success"
        });
    } catch(e){
        next(e);
    }
});