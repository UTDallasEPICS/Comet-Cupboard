import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/items";
import * as categorySchema from "../schema/category";
import * as itemLogSchema from "../schema/itemLog";
import { Category, Items, ItemLog, CheckoutLog, Donor } from "../models";
import multer from 'multer';
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
      // add image
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
    // maybe do something to remove all associated item logs with it as well?
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

// Returns items with a given name
router.get("/itemSearch/:search", async (req, res, next) => {
  try {
    if(!req.params.search)
    {
      return next({ message: "Search query is required", status: status.BAD_REQUEST });
    }
    const itemRes = await Items.find({"name":{'$regex': req.params.search , '$options' :'i'}});
    res.send({item : itemRes});
  } catch (e) {
    next(e);
  }
});

// Returns all items in a category
router.get("/categoryItems/:category", async (req, res,next) => 
{
  try
  {
    if(!req.params.category)
    {
      return next({ message: "Category is required", status: status.BAD_REQUEST });
    }
    const existingCategory = await Category.findOne({ _id: req.params.category });
    if(!existingCategory)
    {
      return next({
        message: "Category not found",
        status: status.BAD_REQUEST
      });
    }

    const itemRes = await Items.find({"categoryID": existingCategory._id});
    res.send({item : itemRes});
      
  }
  catch(e) 
  {
    next(e);
  }
})

// Returns all items in a category with a given name
router.get("/categoryItems/:category/:search", async (req, res,next) => 
{
  try
  {
    if(!req.params.category)
    {
      return next({ message: "Category is required", status: status.BAD_REQUEST });
    }
    if(!req.params.search)
    {
      return next({ message: "Search filter is required", status: status.BAD_REQUEST });
    }
    const existingCategory = await Category.findOne({ _id: req.params.category });
    if(!existingCategory)
    {
      return next({
        message: "Category not found",
        status: status.BAD_REQUEST
      });
    }
    const itemRes = await Items.find({$and:[{"categoryID": existingCategory._id}, {"name":{'$regex': req.params.search , '$options' :'i'}}]})
    res.send({item : itemRes});
      
  }
  catch(e) 
  {
    next(e);
  }
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/test-image-upload", upload.single('image'), validateSchema(schema.CreateItemSchema), async (req: schema.ICreateItemSchema, res, next) =>{
  try{

    const existingItem = await Items.findOne({ name: req.body.name });
      existingItem?.createdAt
    if (existingItem) {
      return next({
        message: "Item already exists",
        status: status.BAD_REQUEST
      });
    }
    
    if(!req.file)
    {
      return next({
        message: "Image is Required",
        // Replace with default img url or maybe
        // Then
        status: status.BAD_REQUEST
      });
    }

    if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return next({
        message: "Please upload an image file (jpg, jpeg, png)",
        status: status.BAD_REQUEST
      });
    }

    if (req.file.size > 1024 * 1024) {
      return next({
        message: "File size should be less than 1MB",
        status: status.BAD_REQUEST
      });
    }

    const image = req.file.buffer.toString("base64");
    
    const item = new Items({
      name: req.body.name,
      location: req.body.location,
      quantity: req.body.quantity,
      size: req.body.size,
      image : image,
      deal : req.body.deal,
      categoryID: req.body.categoryID
    });

      await item.save()
      res.send({message : "Recieved New Item"});
  }
  catch(e)
  {
    next(e);
  }
  
})

router.put("/:id", validateSchema(MongoIdSchema), upload.single('image'), async (req: schema.ICreateItemSchema, res, next) =>{
  try{

    if (!req.params.id) {
      return next({ message: "Id is required", status: status.BAD_REQUEST });
    }

    const existingItem = await Items.findOne({ _id: req.params.id });
    if (!existingItem) {
      return next({
        message: "Item does not exists.",
        status: status.BAD_REQUEST
      });
    }
    
    // If image is given then do upload, if no image given the fill with prev image.
    if(req.file)
    {

      if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return next({
          message: "Please upload an image file (jpg, jpeg, png)",
          status: status.BAD_REQUEST
        });
      }
  
      if (req.file.size > 1024 * 1024) {
        return next({
          message: "File size should be less than 1MB",
          status: status.BAD_REQUEST
        });
      }

      await Items.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          location: req.body.location,
          quantity: req.body.quantity,
          size: req.body.size,
          image : req.file.buffer.toString("base64"),
          deal : req.body.deal,
          categoryID: req.body.categoryID
        },
        {
          new: true
        });
    }
    else
    {
      await Items.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          location: req.body.location,
          quantity: req.body.quantity,
          size: req.body.size,
          image : req.body.image,
          deal : req.body.deal,
          categoryID: req.body.categoryID
        },
        {
          new: true
        });
    }
    
    res.send({message : "Successfully Updated Item"});
  }
  catch(e)
  {
    next(e);
  }
  
})

router.get("/itemLogs/expiredItems", async (req, res, next) =>{
  // This should return all itemlogs that have expired on or before the requested date.
  try
  {
    let expList = []
    const currDate = new Date();
    const expiredItemLogs = await ItemLog.find();
    for(let i = 0; i < expiredItemLogs.length; i++)
    {
      if(expiredItemLogs[i].expDate)
      {
        // Add a check for the actionType of the itemLog, so if it's a purchase then it shouldn't count as the item does no longer exist.
        if((Date.parse(expiredItemLogs[i].expDate) <= Date.parse(currDate.toISOString())))
        {
          expList.push(expiredItemLogs[i]);
        }
      }

    }
    if(expList.length <= 0)
    {
      res.send({message : "There are no expired item logs at the moment. Please check again at a later date."});
    }
    else
    {
      res.send({expiredItemLogs : expList});
    }
    
  } catch(e)
  {
    next(e);
  }
  // Create another post function to deal with it,
  // If expired they can either 
  // remove from db
  // move to expired shelf and change date
  // leave and change date? -> this would be when you edit an item log.
  

})

// If an item log has expired items this method is a way to resolve those expired item logs, you can either move it to the expired shelf and give it a new expiration date 
// or you can throw out the items and remove them from the database.
// This POST method does one of the following to an itemLog
// If the item log has expired before then you should probably throw it out 
// 1) It will request the worker to move it to the expired shelf where it will take on a new expiration date, and quantity to be moved
// 2) It will request to delete these items from the database as they have either expired before and need to be thrown out, it will take the quantity to be removed. It also updates the database as well as the itemlog.
router.post("/itemLogs/expiredItems/:id", async (req, res, next) =>{
  try {
    // Param id is for itemLog
    if (!req.params.id) {
      return next({ message: "Id is required", status: status.BAD_REQUEST });
    }
    if(!req.body.actionType)
    {
      return next({ message: "actionType is required", status: status.BAD_REQUEST });
    }

    const itemLog = await ItemLog.findOne({ _id: req.params.id });
    if(!itemLog)
    {
      return next({
        message: "Itemlog not found",
        status: status.BAD_REQUEST
      });
    }

    const currItem = await Items.findOne({_id : itemLog.item})
    if(!currItem)
    {
      return next({
        message: "The Item for this item log currently does not exist.",
        status: status.BAD_REQUEST
      });
    }

    if(!req.body.quantity)
    {
      return next({
        message: "Please provide an amount of items to move to the expired shelf",
        status: status.BAD_REQUEST
      });
    }

    // This is when the item has INITIALLY expired and you want to move them to the expired shelf
    if(req.body.actionType == "MoveToExpiredItemShelf")
    {
      if(!req.body.newDate)
      {
        return next({
          message: "Please provide a new date for the expired item.",
          status: status.BAD_REQUEST
        });
      }

      const currDate = new Date();

      if(Date.parse(req.body.newDate) <= Date.parse(currDate.toISOString()) )
      {
        return next({
          message: "The date you provided for the new expired item is on or before the current date, Please enter a new date or remove the item from the database.",
          status: status.BAD_REQUEST
        });
      }

      if (itemLog.hasExpired === true)
      {
        return next({
          message: `These items have been marked as expired before, please select the RemoveExpiredItemFromDatabase option to remove these items`,
          status: status.BAD_REQUEST
        });
      }
      else if(currItem.quantity < req.body.quantity)
      {
        return next({
          message: `There are currently ${currItem.quantity} amount of this item remaining and you want to move ${req.body.quantity} to the expired shelf. Please recheck the amount you want to move.`,
          status: status.BAD_REQUEST
        });
      }
      else
      {
          itemLog.updateOne({
            expDate : req.body.newDate,
            quantity: req.body.quantity,
            actionType: req.body.actionType,
            hasExpired : true
          })
          res.send({message: "Successfully updated item log"})
      }
    }
      // This is for if the item has expired before and you want to remove any items from this itemlog from the database.
    else if(req.body.actionType == "RemoveExpiredItemFromInventory")
    {
      // This is for if the item has already been expired previously and now they want to remove it from the cupboard hence remoivng it from the Database
      if(currItem.quantity < req.body.quantity )
      {
        return next({
          message: `There are currently ${currItem.quantity} amount of this item remaining and you want to remove ${req.body.quantity}. Please enter a proper amount to remove.`,
          status: status.BAD_REQUEST
        });
      }
      else
      {
        await Items.updateOne({$and:[{ _id: itemLog.item }, {"quantity": currItem.quantity - req.body.quantity}]})
        await itemLog.updateOne({
          expDate : null,
          quantity: req.body.quantity,
          actionType: req.body.actionType
        })
        res.send({message : "Successfully Updated Itemlog"})
      }  
    }
    // This last else is for testing purposes only
    else
    {
      res.send({message : "?????"})
    }

    
  } catch (e) {
    next(e);
  }
})

// For all itemLogs, gets ItemLog with specific actionType
router.get("/itemLogs/:actionType", async (req, res, next) =>{
  try
  {
      if(!req.params.actionType)
      {
        res.send({message : "Please provide an actionType for the itemLog", status: status.BAD_REQUEST});
      }
      const ItemLogs = await ItemLog.find({actionType: {'$regex': req.params.actionType , '$options' :'i'} });
      res.send({itemLogs : ItemLogs})
  }
  catch(e)
  {
    next(e);
  }
})

// For a specific item and all itemLogs of it with a specific actionType
router.get("/itemLogs/:id/:actionType", async (req, res, next) =>{
  try
  {
      // ItemID
      if(!req.params.id)
      {
        res.send({message : "Please provide an id for the itemlog", status: status.BAD_REQUEST});
      }
      if(!req.params.actionType)
      {
        res.send({message : "Please provide an actionType for the itemLog", status: status.BAD_REQUEST});
      }
      const ItemLogs = await ItemLog.find({$and:[{ item: req.params.id }, {actionType: {'$regex': req.params.actionType , '$options' :'i'} }]});
      if(ItemLogs.length == 0)
      {
        // I might just handle it on the frontend.
        res.send({message : `There are no itemlogs for this item with the action type ${req.params.actionType}`});
      }
      else
      {
        res.send({itemLogs : ItemLogs})
      }
      
  }
  catch(e)
  {
    next(e);
  }
})

// Itemlog Action Types
  // AddedToInventory
  // RemovedFromInventory
  // MovedToExpiredShelf
  // RemoveExpiredItemFromShelf
  // Checkout
router.get("/itemLogs/actionTypes", async(req,res,next) =>
{
  try
  {
    let actionTypes = ["AddedToInventory", "RemovedFromInventory", "MovedToExpiredShelf", "RemoveExpiredItemFromShelf", "Checkout"];
    res.send({actionTypes : actionTypes});
  }
  catch(e)
  {
    next(e);
  }
})

// What should a good inventory system have?




