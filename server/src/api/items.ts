import express from "express"
import status from "http-status"
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema"
import * as schema from "../schema/items"
import * as categorySchema from "../schema/category"
import * as itemLogSchema from "../schema/itemLog"
import { Category, Items, ItemLog, CheckoutLog, Donor } from "../models"
import multer from "multer"
export const router = express.Router()
import mongoose from "mongoose"

router.post("/categories", validateSchema(categorySchema.CreateCategorySchema), async (req: categorySchema.ICreateCategorySchema, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		const existingCategory = await Category.findOne({ name: req.body.name })
		if (existingCategory) {
			return next({
				message: "Category already exists",
				status: status.BAD_REQUEST,
			})
		}
		const category = new Category({
			name: req.body.name,
			description: req.body.description,
			color: req.body.color,
		})
		await category.save()
		res.send({ message: "Successfully created a category" })
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

router.put("/categories", validateSchema(categorySchema.CreateCategorySchema), async (req: categorySchema.ICreateCategorySchema, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		const existingCategory = await Category.findOne({ name: req.body.name })
		if (!existingCategory) {
			return next({
				message: "Category does not already exists",
				status: status.BAD_REQUEST,
			})
		}
		await Category.findOneAndUpdate(
			{
				name: req.body.name,
			},
			{
				description: req.body.description,
				color: req.body.color,
			},
			{
				new: true,
			}
		)
		res.send({ message: "Successfully updated Category!" })
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

router.get("/", async (req, res, next) => {
	try {
		const item = await Items.find()
		res.send({ item: item })
	} catch (e) {
		next(e)
	}
})

router.get("/categories", async (req, res, next) => {
	try {
		const categories = await Category.find()
		res.send({ categories: categories })
	} catch (e) {
		next(e)
	}
})

router.get("/itemLogs", async (req, res, next) => {
	try {
		const itemLogs = await ItemLog.find()
		res.send({ logs: itemLogs })
	} catch (e) {
		next(e)
	}
})

router.post("/itemLog", validateSchema(itemLogSchema.CreateItemLogSchema), async (req: itemLogSchema.ICreateItemLogSchema, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		const checkoutLog = await CheckoutLog.findOne({ _id: req.body.checkoutID })
		if (!checkoutLog) {
			return next({
				message: "Checkout Log does not exist",
				status: status.BAD_REQUEST,
			})
		}
		const item = await Items.findOne({ _id: req.body.item })
		if (!item) {
			return next({
				message: "Item does not exist",
				status: status.BAD_REQUEST,
			})
		}
		const donor = await Donor.findOne({ _id: req.body.donor })
		if (!donor) {
			return next({
				message: "Donor does not exist",
				status: status.BAD_REQUEST,
			})
		}
		const itemLog = new ItemLog({
			checkoutID: req.body.checkoutID,
			expDate: req.body.expDate,
			item: req.body.item,
			quantity: req.body.quantity,
			donor: req.body.donor,
			actionType: req.body.actionType,
		})
		await itemLog.save()
		res.send({ message: "Succesfully created Item Log" })
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

router.delete("/itemLog/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		if (!req.params.id) {
			return next({ message: "Id is required" })
		}
		await ItemLog.deleteOne({ _id: req.params.id })

		res.send({ message: "Succesfully deleted account" })
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

router.put("/itemLog/:id", validateSchema(itemLogSchema.CreateItemLogSchema), async (req: itemLogSchema.ICreateItemLogSchema, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		const existingItem = await ItemLog.findOne({ _id: req.params.id })
		if (!existingItem) {
			return next({
				message: "Item does not exist",
				status: status.BAD_REQUEST,
			})
		}
		await existingItem.update({
			checkoutID: req.body.checkoutID,
			expDate: req.body.expDate,
			item: req.body.item,
			quantity: req.body.quantity,
			donor: req.body.donor,
			actionType: req.body.actionType,
		})
		res.send({ message: "Successfully updated itemLog" })
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

router.delete("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		if (!req.params.id) {
			return next({ message: "ID is required", status: status.BAD_REQUEST })
		}
		await Items.deleteOne({ _id: req.params.id })
		// maybe do something to remove all associated item logs with it as well?
		res.send({ message: "Succesfully deleted item" })
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

router.delete("/categories/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		if (!req.params.id) {
			return next({ message: "ID is required", status: status.BAD_REQUEST })
		}
		await Category.deleteOne({ _id: req.params.id })
		res.send({ message: "Succesfully deleted category" })
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

router.get("/categories/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
	try {
		if (!req.params.id) {
			return next({ message: "Id is required", status: status.BAD_REQUEST })
		}
		const existingCategory = await Category.findOne({ _id: req.params.id })
		if (!existingCategory) {
			return next({
				message: "Category not found",
				status: status.BAD_REQUEST,
			})
		}

		res.send({ category: existingCategory })
	} catch (e) {
		next(e)
	}
})

router.get("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
	try {
		if (!req.params.id) {
			return next({ message: "Id is required", status: status.BAD_REQUEST })
		}
		const existingItem = await Items.findOne({ _id: req.params.id })
		if (!existingItem) {
			return next({
				message: "Item not found",
				status: status.BAD_REQUEST,
			})
		}

		res.send({ item: existingItem })
	} catch (e) {
		next(e)
	}
})

router.get("/itemLog/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
	try {
		if (!req.params.id) {
			return next({ message: "Id is required", status: status.BAD_REQUEST })
		}
		const itemLogs = await ItemLog.findOne({ _id: req.params.id })
		res.send({ itemlog: itemLogs })
	} catch (e) {
		next(e)
	}
})

// Add Update quantity put  method so that it'll be easier rather than sending all of the fields separately
router.put("/updateStock/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		if (!req.params.id) {
			return next({ message: "Id is required", status: status.BAD_REQUEST })
		}
		const existingItem = await Items.findOne({ _id: req.params.id })
		if (!existingItem) {
			return next({
				message: "Item not found",
				status: status.BAD_REQUEST,
			})
		}
		await existingItem.updateOne({ quantity: existingItem.quantity + req.body.quantity })
		const newItemLog = new ItemLog({
			expDate: req.body.expDate,
			item: req.params.id,
			quantity: req.body.quantity,
			donor: req.body.donor,
			actionType: "AddedToInventory",
		})
		await existingItem.save()
		await newItemLog.save()

		res.send({ message: `Updated Stock for item ${existingItem.name}` })
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})
// Returns items with a given name
router.get("/itemSearch/:search", async (req, res, next) => {
	try {
		if (!req.params.search) {
			return next({ message: "Search query is required", status: status.BAD_REQUEST })
		}
		const itemRes = await Items.find({ name: { $regex: req.params.search, $options: "i" } })
		res.send({ item: itemRes })
	} catch (e) {
		next(e)
	}
})

// Returns all items in a category
router.get("/categoryItems/:category", async (req, res, next) => {
	try {
		if (!req.params.category) {
			return next({ message: "Category is required", status: status.BAD_REQUEST })
		}
		const existingCategory = await Category.findOne({ _id: req.params.category })
		if (!existingCategory) {
			return next({
				message: "Category not found",
				status: status.BAD_REQUEST,
			})
		}

		const itemRes = await Items.find({ categoryID: existingCategory._id })
		res.send({ item: itemRes })
	} catch (e) {
		next(e)
	}
})

// Returns all items in a category with a given name
router.get("/categoryItems/:category/:search", async (req, res, next) => {
	try {
		if (!req.params.category) {
			return next({ message: "Category is required", status: status.BAD_REQUEST })
		}
		if (!req.params.search) {
			return next({ message: "Search filter is required", status: status.BAD_REQUEST })
		}
		const existingCategory = await Category.findOne({ _id: req.params.category })
		if (!existingCategory) {
			return next({
				message: "Category not found",
				status: status.BAD_REQUEST,
			})
		}
		const itemRes = await Items.find({ $and: [{ categoryID: existingCategory._id }, { name: { $regex: req.params.search, $options: "i" } }] })
		res.send({ item: itemRes })
	} catch (e) {
		next(e)
	}
})

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// Creates the item
router.post("/", upload.single("image"), validateSchema(schema.CreateItemSchema), async (req: schema.ICreateItemSchema, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		const existingItem = await Items.findOne({ name: req.body.name })
		existingItem?.createdAt
		if (existingItem) {
			return next({
				message: "Item already exists",
				status: status.BAD_REQUEST,
			})
		}

		if (req.file) {
			if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/)) {
				return next({
					message: "Please upload an image file (jpg, jpeg, png)",
					status: status.BAD_REQUEST,
				})
			}

			if (req.file.size > 1024 * 1024) {
				return next({
					message: "File size should be less than 1MB",
					status: status.BAD_REQUEST,
				})
			}

			const image = req.file.buffer.toString("base64")

			const item = new Items({
				name: req.body.name,
				location: req.body.location,
				quantity: req.body.quantity,
				size: req.body.size,
				image: image,
				deal: req.body.deal,
				categoryID: req.body.categoryID,
			})

			await item.save()
			res.send({ message: "Recieved New Item" })
		} else {
			// To use in an HTML image tag <img src = data:image/png;base64, defaultImageBase64String></img>
			// Replace with any base64 image string
			const defaultImage =
				"iVBORw0KGgoAAAANSUhEUgAAA4QAAAGdCAMAAAB91k1zAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAMAUExURUdwTMZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEsZbEq4XxAUAAAD/dFJOUwAQ8JCAMOAgQFCg0AH+wP1g/PoDAvsE9Ab39nAF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"

			const item = new Items({
				name: req.body.name,
				location: req.body.location,
				quantity: req.body.quantity,
				size: req.body.size,
				image: defaultImage,
				deal: req.body.deal,
				categoryID: req.body.categoryID,
			})

			await item.save()
			res.send({ message: "Recieved New Item" })
		}
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

router.put("/:id", validateSchema(MongoIdSchema), upload.single("image"), async (req: schema.ICreateItemSchema, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		if (!req.params.id) {
			return next({ message: "Id is required", status: status.BAD_REQUEST })
		}

		const existingItem = await Items.findOne({ _id: req.params.id })
		if (!existingItem) {
			return next({
				message: "Item does not exists.",
				status: status.BAD_REQUEST,
			})
		}

		// If image is given then do upload, if no image given the fill with prev image.
		if (req.file) {
			if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/)) {
				return next({
					message: "Please upload an image file (jpg, jpeg, png)",
					status: status.BAD_REQUEST,
				})
			}

			if (req.file.size > 1024 * 1024) {
				return next({
					message: "File size should be less than 1MB",
					status: status.BAD_REQUEST,
				})
			}

			await Items.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					name: req.body.name,
					location: req.body.location,
					quantity: req.body.quantity,
					size: req.body.size,
					image: req.file.buffer.toString("base64"),
					deal: req.body.deal,
					categoryID: req.body.categoryID,
				},
				{
					new: true,
				}
			)
		} else {
			await Items.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					name: req.body.name,
					location: req.body.location,
					quantity: req.body.quantity,
					size: req.body.size,
					image: req.body.image,
					deal: req.body.deal,
					categoryID: req.body.categoryID,
				},
				{
					new: true,
				}
			)
		}

		res.send({ message: "Successfully Updated Item" })
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

router.get("/itemLogs/expiredItems", async (req, res, next) => {
	// This should return all itemlogs that have expired on or before the requested date.
	try {
		let expList = []
		const currDate = new Date()
		const expiredItemLogs = await ItemLog.find()
		for (let i = 0; i < expiredItemLogs.length; i++) {
			if (expiredItemLogs[i].expDate) {
				// Add a check for the actionType of the itemLog, so if it's a purchase then it shouldn't count as the item does no longer exist.
				if (Date.parse(expiredItemLogs[i].expDate) <= Date.parse(currDate.toISOString())) {
					expList.push(expiredItemLogs[i])
				}
			}
		}
		if (expList.length <= 0) {
			res.send({ message: "There are no expired item logs at the moment. Please check again at a later date." })
		} else {
			res.send({ expiredItemLogs: expList })
		}
	} catch (e) {
		next(e)
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
router.post("/itemLogs/expiredItems/:id", async (req, res, next) => {
	try {
		// Param id is for itemLog
		if (!req.params.id) {
			return next({ message: "Id is required", status: status.BAD_REQUEST })
		}
		if (!req.body.actionType) {
			return next({ message: "actionType is required", status: status.BAD_REQUEST })
		}

		const itemLog = await ItemLog.findOne({ _id: req.params.id })
		if (!itemLog) {
			return next({
				message: "Itemlog not found",
				status: status.BAD_REQUEST,
			})
		}

		const currItem = await Items.findOne({ _id: itemLog.item })
		if (!currItem) {
			return next({
				message: "The Item for this item log currently does not exist.",
				status: status.BAD_REQUEST,
			})
		}

		if (!req.body.quantity) {
			return next({
				message: "Please provide an amount of items to move to the expired shelf",
				status: status.BAD_REQUEST,
			})
		}

		// This is when the item has INITIALLY expired and you want to move them to the expired shelf
		if (req.body.actionType == "MoveToExpiredItemShelf") {
			if (!req.body.newDate) {
				return next({
					message: "Please provide a new date for the expired item.",
					status: status.BAD_REQUEST,
				})
			}

			const currDate = new Date()

			if (Date.parse(req.body.newDate) <= Date.parse(currDate.toISOString())) {
				return next({
					message:
						"The date you provided for the new expired item is on or before the current date, Please enter a new date or remove the item from the database.",
					status: status.BAD_REQUEST,
				})
			}

			if (itemLog.hasExpired === true) {
				return next({
					message: `These items have been marked as expired before, please select the RemoveExpiredItemFromDatabase option to remove these items`,
					status: status.BAD_REQUEST,
				})
			} else if (currItem.quantity < req.body.quantity) {
				return next({
					message: `There are currently ${currItem.quantity} amount of this item remaining and you want to move ${req.body.quantity} to the expired shelf. Please recheck the amount you want to move.`,
					status: status.BAD_REQUEST,
				})
			} else {
				itemLog.updateOne({
					expDate: req.body.newDate,
					quantity: req.body.quantity,
					actionType: req.body.actionType,
					hasExpired: true,
				})
				res.send({ message: "Successfully updated item log" })
			}
		}
		// This is for if the item has expired before and you want to remove any items from this itemlog from the database.
		else if (req.body.actionType == "RemoveExpiredItemFromInventory") {
			// This is for if the item has already been expired previously and now they want to remove it from the cupboard hence remoivng it from the Database
			if (currItem.quantity < req.body.quantity) {
				return next({
					message: `There are currently ${currItem.quantity} amount of this item remaining and you want to remove ${req.body.quantity}. Please enter a proper amount to remove.`,
					status: status.BAD_REQUEST,
				})
			} else {
				await Items.updateOne({ $and: [{ _id: itemLog.item }, { quantity: currItem.quantity - req.body.quantity }] })
				await itemLog.updateOne({
					expDate: null,
					quantity: req.body.quantity,
					actionType: req.body.actionType,
				})
				res.send({ message: "Successfully Updated Itemlog" })
			}
		}
		// This last else is for testing purposes only
		else {
			res.send({ message: "?????" })
		}
	} catch (e) {
		next(e)
	}
})

// For all itemLogs, gets ItemLog with specific actionType
router.get("/itemLogs/:actionType", async (req, res, next) => {
	try {
		if (!req.params.actionType) {
			res.send({ message: "Please provide an actionType for the itemLog", status: status.BAD_REQUEST })
		}
		const ItemLogs = await ItemLog.find({ actionType: { $regex: req.params.actionType, $options: "i" } })
		res.send({ itemLogs: ItemLogs })
	} catch (e) {
		next(e)
	}
})

// For a specific item and all itemLogs of it with a specific actionType
router.get("/itemLogs/:id/:actionType", async (req, res, next) => {
	try {
		// ItemID
		if (!req.params.id) {
			res.send({ message: "Please provide an id for the itemlog", status: status.BAD_REQUEST })
		}
		if (!req.params.actionType) {
			res.send({ message: "Please provide an actionType for the itemLog", status: status.BAD_REQUEST })
		}
		const ItemLogs = await ItemLog.find({ $and: [{ item: req.params.id }, { actionType: { $regex: req.params.actionType, $options: "i" } }] })
		if (ItemLogs.length == 0) {
			// I might just handle it on the frontend.
			res.send({ message: `There are no itemlogs for this item with the action type ${req.params.actionType}` })
		} else {
			res.send({ itemLogs: ItemLogs })
		}
	} catch (e) {
		next(e)
	}
})

// Itemlog Action Types
// AddedToInventory
// RemovedFromInventory
// MovedToExpiredShelf
// RemoveExpiredItemFromShelf
// Checkout
// Feel Free to add more if needed.
router.get("/itemLogs/actionTypes", async (req, res, next) => {
	try {
		let actionTypes = ["AddedToInventory", "RemovedFromInventory", "MovedToExpiredShelf", "RemoveExpiredItemFromShelf", "Checkout"]
		res.send({ actionTypes: actionTypes })
	} catch (e) {
		next(e)
	}
})

// What should a good inventory system have?
