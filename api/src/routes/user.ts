import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/user";
import * as demographicsSchema from "../schema/demographics";
import { User } from "../models";
import { Demographics } from "../models";

export const router = express.Router();

// create new account
router.post("/", validateSchema(schema.CreateUserSchema), async (req: schema.ICreateUserSchema, res, next) => {
  try {
    const existingUser = await User.findOne({ test: req.body.netID });
    if (existingUser) {
      return next({
        message: "Account already exists",
        status: status.BAD_REQUEST
      });
    }
    const user = new User({
      ...req.body
    });
    await user.save();

    res.send({ message: "Successfully created account!" });
  } catch (e) {
    next(e);
  }
});

router.post("/demographics/", validateSchema(demographicsSchema.CreateDemographicsSchema), async (req: demographicsSchema.ICreateDemographicsSchema, res, next) => {
  try {
    const exisitingUser = await User.findOne({ test: req.body.netID });
    if(!exisitingUser) {
      return next({
        message: "Account doesn't exist",
        status: status.BAD_REQUEST
      });
    }
    const demographics = new Demographics({
      netID: req.body.netID,
      numChild: req.body.numChild,
      numParents: req.body.numParents,
      numOld: req.body.numOld,
      income: req.body.income
    });
    await demographics.save();
    res.send({ message: "Successfully created new demographics form! "});
  } catch (e) {
    next(e);
  }
});
// get all accounts
router.get("/", async (req, res, next) => {
  try {
    const Users = await User.find();
    res.send({ accounts: Users });
  } catch (e) {
    next(e);
  }
});

// get one acccount
router.get("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
  try {
    if (!req.params.id) {
      return next({ message: "Id is required", status: status.BAD_REQUEST });
    }
    const existingUser = await User.findOne({ _id: req.params.id });
    if (!existingUser) {
      return next({
        message: "Account not found",
        status: status.BAD_REQUEST
      });
    }

    res.send({ account: existingUser });
  } catch (e) {
    next(e);
  }
});

// create new account
router.delete("/:id", validateSchema(MongoIdSchema), async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next({ message: "Id is required", status: status.BAD_REQUEST });
    }
    await User.deleteOne({ _id: req.params.id });

    res.send({ message: "Successfully deleted account" });
  } catch (e) {
    next(e);
  }
});


// update exisiting account
router.put("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
  try {
    const existingUser = await User.findOne({_id: req.params.id });
    if (!existingUser) {
      return next({
        message: "Account does not exists",
        status: status.BAD_REQUEST
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      {_id: req.params.id},
       {
        numChild: 4
       },
       {
        new: true
      });
    res.send(updatedUser);
  } catch(e) {
    next(e);
  }
});

