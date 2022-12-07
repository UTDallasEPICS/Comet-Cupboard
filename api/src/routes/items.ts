import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/items";
import { Items } from "../models";
//import * as ItemLogSchema from "../schema/itemLog";

export const router = express.Router();

router.post("/", validateSchema(schema.CreateItemSchema), async (req: schema.ICreateItemSchema, res, next) => {
    try {
        const existingItem = await Items.findOne({ name: req.body.name });
        if (existingItem) {
          return next({
            message: "Item already exists",
            status: status.BAD_REQUEST
          });
        }
        const item = new Items({
          name: req.body.name,
          location: req.body.location,
          quantity: req.body.quantity,
          size: req.body.size
        });
        await item.save();
        res.send({ message: "Successfully created an item" });
      } catch (e) {
        next(e);
      }
});

router.put("/", validateSchema(schema.CreateItemSchema), async(req: schema.ICreateItemSchema, res, next) => {
    try {
        const existingItem = await Items.findOne({ name: req.body.name });
        if (!existingItem) {
          return next({
            message: "Item does not already exists",
            status: status.BAD_REQUEST
          });
        }
          await Items.findOneAndUpdate(
          {
            name: req.body.name
          },
           {
            location: req.body.location,
            quantity: req.body.quantity,
            size: req.body.size
           },
           {
            new: true
          });
        res.send({ message: "Successfully updated item!" });
      } catch(e) {
        next(e);
      }
});

router.get("/", async (req, res, next) => {
    try {
        const items = await Items.find();
        res.send({ items: items });
      } catch (e) {
        next(e);
      }
});

router.get("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
    try {
      if (!req.params.id) {
        return next({ message: "Id is required", status: status.BAD_REQUEST });
      }
      const existingItem = await Items.findOne({ _id: req.params.id });
      if (!existingItem) {
        return next({
          message: "Item not found",
          status: status.BAD_REQUEST
        });
      }
  
      res.send({ item: existingItem });
    } catch (e) {
      next(e);
    }
  });

  //ItemLog Routes --------------------------------------------------------------------------------------
  router.get("/logs", async (req, res, next) => {
    try {
      if (!req.params.id) {
        return next({ message: "Id is required", status: status.BAD_REQUEST });
      }
      const existingItem = await Items.findOne({ _id: req.params.id });
      if (!existingItem) {
        return next({
          message: "Item not found",
          status: status.BAD_REQUEST
        });
      }
  
      res.send({ account: existingItem });
    } catch (e) {
      next(e);
    }
  });
