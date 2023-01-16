import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/items";
import * as categorySchema from "../schema/category";
import { Category, Items } from "../models";

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
          size: req.body.size,
          categoryID: req.body.categoryID
        });
        await item.save();
        res.send({ message: "Successfully created an item" });
      } catch (e) {
        next(e);
      }
});

router.post("/categories", validateSchema(categorySchema.CreateCategorySchema), async (req: categorySchema.ICreateCategorySchema, res, next) => {
  try {
      const existingCategory = await Category.findOne({ name: req.body.name });
      if (existingCategory) {
        return next({
          message: "Category already exists",
          status: status.BAD_REQUEST
        });
      }
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        color: req.body.color
      });
      await category.save();
      res.send({ message: "Successfully created a category" });
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
            size: req.body.size,
            categoryID: req.body.categoryID
           },
           {
            new: true
          });
        res.send({ message: "Successfully updated item!" });
      } catch(e) {
        next(e);
      }
});

router.put("/categories", validateSchema(categorySchema.CreateCategorySchema), async(req: categorySchema.ICreateCategorySchema, res, next) => {
  try {
      const existingCategory = await Category.findOne({ name: req.body.name });
      if (!existingCategory) {
        return next({
          message: "Category does not already exists",
          status: status.BAD_REQUEST
        });
      }
        await Category.findOneAndUpdate(
        {
          name: req.body.name
        },
         {
          description: req.body.description,
          color: req.body.color
         },
         {
          new: true
        });
      res.send({ message: "Successfully updated Category!" });
    } catch(e) {
      next(e);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const item = await Items.find();
        res.send({ item: item });
      } catch (e) {
        next(e);
      }
});

router.get("/categories", async (req, res, next) => {
  try {
      const categories = await Category.find();
      res.send({ categories: categories });
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

  router.get("/categories/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
    try {
      if (!req.params.id) {
        return next({ message: "Id is required", status: status.BAD_REQUEST });
      }
      const existingCategory = await Category.findOne({ _id: req.params.id });
      if (!existingCategory) {
        return next({
          message: "Category not found",
          status: status.BAD_REQUEST
        });
      }
  
      res.send({ category: existingCategory });
    } catch (e) {
      next(e);
    }
  });
