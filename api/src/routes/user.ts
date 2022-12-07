// Route Endpoint for all things related to the User
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
    const existingUser = await User.findOne({ netID: req.body.netID });
    if (existingUser) {
      return next({
        message: "Account already exists",
        status: status.BAD_REQUEST
      });
    }
    const user = new User({
      netID: req.body.netID
    });
    await user.save();
    // remember to send a response back to whoever is requesting or else it will infinitely wait
    res.send({ message: "Successfully created account!" });
  } catch (e) {
    next(e);
  }
});

// create new Demographics form for an exisiting user
router.post("/demographics", validateSchema(demographicsSchema.CreateDemographicsSchema), async (req: demographicsSchema.ICreateDemographicsSchema, res, next) => {
  try {
    const exisitingUser = await User.findOne({ _id: req.body.userID });
    if(!exisitingUser) {
      return next({
        message: "Account doesn't exist",
        status: status.BAD_REQUEST
      });
    }
    const demographics = new Demographics({
      userID: req.body.userID,
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

// get all demographics currently in the system
router.get("/demographics", async (req, res, next) => {
  try {
    const Demos = await Demographics.find();
    res.send({ demographics: Demos });
  } catch (e) {
    next(e);
  }
});

// get a specific form
router.get("/demographics/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
  try {
    if (!req.params.id) {
      return next({ message: "Id is required", status: status.BAD_REQUEST });
    }
    const existingForm = await Demographics.findOne({ _id: req.params.id });
    if (!existingForm) {
      return next({
        message: "Form not found",
        status: status.BAD_REQUEST
      });
    }

    res.send({ demographic: existingForm });
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

// delete new account
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


// update exisiting form
router.put("/demographics", validateSchema(demographicsSchema.CreateDemographicsSchema), async (req: demographicsSchema.ICreateDemographicsSchema, res, next) => {
  try {
    const existingForm = await Demographics.findOne({ userID: req.body.userID });
    if (!existingForm) {
      return next({
        message: "Form does not already exists",
        status: status.BAD_REQUEST
      });
    }
      await Demographics.findOneAndUpdate(
      {
        userID: req.body.userID
      },
       {
        numChild: req.body.numChild,
        numParents: req.body.numParents,
        numOld: req.body.numOld,
        income: req.body.income
       },
       {
        new: true
      });
    res.send({ message: "Successfully updated form!" });
  } catch(e) {
    next(e);
  }
});

