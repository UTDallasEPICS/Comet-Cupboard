import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/items";
import * as categorySchema from "../schema/category";
import * as itemLogSchema from "../schema/itemLog";
import { Category, Items, ItemLog, CheckoutLog, Donor } from "../models";

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

router.post("/categories", validateSchema(categorySchema.CreateCategorySchema),
  async (req: categorySchema.ICreateCategorySchema, res, next) => {
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
  }
);

//this needs logic check
//look into update of quantity and whether look up should be name or id
router.put("/", validateSchema(schema.CreateItemSchema), async (req: schema.ICreateItemSchema, res, next) => {
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
      }
    );
    res.send({ message: "Successfully updated item!" });
  } catch (e) {
    next(e);
  }
});

router.put("/categories",
  validateSchema(categorySchema.CreateCategorySchema),
  async (req: categorySchema.ICreateCategorySchema, res, next) => {
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
        }
      );
      res.send({ message: "Successfully updated Category!" });
    } catch (e) {
      next(e);
    }
  }
);

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

router.get("/itemLogs", async (req, res, next) => {
  try {
    const itemLogs = await ItemLog.find();
    res.send({ logs: itemLogs });
  } catch (e) {
    next(e);
  }
});

router.post("/itemLog", validateSchema(itemLogSchema.CreateItemLogSchema), async (req: itemLogSchema.ICreateItemLogSchema, res, next) => {
  try {
    const checkoutLog = await CheckoutLog.findOne({ _id: req.body.checkoutID });
    if (!checkoutLog) {
      return next({
        message: "Checkout Log does not exist",
        status: status.BAD_REQUEST
      });
    }
    const item = await Items.findOne({ _id: req.body.item });
    if (!item) {
      return next({
        message: "Item does not exist",
        status: status.BAD_REQUEST
      });
    }
    const donor = await Donor.findOne({ _id: req.body.donor });
    if (!donor) {
      return next({
        message: "Donor does not exist",
        status: status.BAD_REQUEST
      });
    }
    const itemLog = new ItemLog({
      checkoutID: req.body.checkoutID,
      expDate: req.body.expDate,
      item: req.body.item,
      quantity: req.body.quantity,
      donor: req.body.donor,
      actionType: req.body.actionType
    });
    await itemLog.save();
    res.send({ message: "Succesfully created Item Log" });
  } catch (e) {
    next(e);
  }
});

router.delete("/itemLog/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
  try {
    if (!req.params.id) {
      return next({ message: "Id is required" });
    }
    await ItemLog.deleteOne({ _id: req.params.id });

    res.send({ message: "Succesfully deleted account" });
  } catch (e) {
    next(e);
  }
});

router.put("/itemLog/:id", validateSchema(itemLogSchema.CreateItemLogSchema), async (req: itemLogSchema.ICreateItemLogSchema, res, next) => {
  try {
    const existingItem = await ItemLog.findOne({ _id: req.params.id });
    if (!existingItem) {
      return next({
        message: "Item does not exist",
        status: status.BAD_REQUEST
      });
    }
    await existingItem.update({
      checkoutID: req.body.checkoutID,
      expDate: req.body.expDate,
      item: req.body.item,
      quantity: req.body.quantity,
      donor: req.body.donor,
      actionType: req.body.actionType
    });
    res.send({ message: "Successfully updated itemLog" });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
  try {
    if (!req.params.id) {
      return next({ message: "ID is required", status: status.BAD_REQUEST });
    }
    await Items.deleteOne({ _id: req.params.id });
    res.send({ message: "Succesfully deleted item" });
  } catch (e) {
    next(e);
  }
});

router.delete("/categories/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
  try {
    if (!req.params.id) {
      return next({ message: "ID is required", status: status.BAD_REQUEST });
    }
    await Category.deleteOne({ _id: req.params.id });
    res.send({ message: "Succesfully deleted category" });
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

router.get("/itemLog/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
  try {
    if(!req.params.id){
      return next({ message: "Id is required", status: status.BAD_REQUEST });
    }
    const itemLogs = await ItemLog.findOne({ _id: req.params.id });
    res.send({ itemlog: itemLogs });
  } catch (e) {
    next(e);
  }
});

