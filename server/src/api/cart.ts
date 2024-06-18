import { cartItem } from "../models/cart/cart"
import express from "express"
import status, { FORBIDDEN } from "http-status"
import { validate as validateSchema } from "../schema"
import * as schema from "../schema/cart"
import { Cart, CheckoutLog, Items } from "../models"
import Categories from "../models/items/Categories"
export const router = express.Router()
import mongoose from "mongoose"

router.post("/", validateSchema(schema.CreateCartSchema), async (req, res, next) => {
	try {
		const { customerId, cartItems } = req.body
		const newCart = new Cart({ customerId, cartItems })
		await newCart.save()
		res.status(201).send({ message: "Successfully created a cart" })
	} catch (error) {
		res.status(500).json({ error: "Could not create the cart." })
		next(error)
	}
})
// ID should be netID
router.post("/addItem/:id", async (req, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		if (!req.params.id) {
			return next({ message: "Id is required", status: status.BAD_REQUEST })
		}
		//Find the cart based on the customer's net ID
		const cart = await Cart.findOne({ customerId: { $regex: req.params.id } })
		if (!cart) {
			return next({ message: "Cart not found", status: status.NOT_FOUND })
		}

		const tempItem = await Items.findOne({ _id: req.body.itemId })
		if (!tempItem) {
			return next({ message: "Could not find item", status: status.NOT_FOUND })
		}

		if (tempItem.quantity <= 0) {
			return next({ message: "Sorry but this item is no longer in stock. Please try again later", status: status.FORBIDDEN })
		}

		if (tempItem.quantity <= req.body.quantity) {
			return next({
				message: "The amount you requested currently isn't available, Please try lowering the amount or trying again later.",
				status: status.FORBIDDEN,
			})
		}

		let inCart = false
		cart.cartItems.forEach((cItem) => {
			if (tempItem._id.equals(cItem.itemId)) {
				inCart = true
			}
		})

		if (!inCart) {
			const newCartItem = new cartItem({
				itemId: req.body.itemId,
				quantity: req.body.quantity,
			})
			cart.cartItems.push(newCartItem)
			await cart.save()
			res.send({ message: "Item Successfully Added To Cart" })
		} else {
			for (let i = 0; i < cart.cartItems.length; i++) {
				let cartItem = cart.cartItems[i]
				if (tempItem._id.equals(cartItem.itemId)) {
					if (cartItem.quantity + req.body.quantity <= tempItem.deal) {
						cartItem.quantity += req.body.quantity
						await cart.save()
						res.send({ message: "Item Successfully Added To Cart" })
					} else {
						return next({
							message: `The amount you've requested to add exceeds the maximum amount allowed (${tempItem.deal}) for the item (${tempItem.name}). Please try lowering the amount or trying again later.`,
							status: status.FORBIDDEN,
						})
					}
				}
			}
		}
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

router.get("/:customerId", async (req, res, next) => {
	try {
		const customerId = req.params.customerId

		// Find the cart based on the customer's ID
		const cart = await Cart.findOne({ customerId })

		if (!cart) {
			return res.status(404).json({ error: "Cart not found" })
		}

		return res.status(200).json(cart)
	} catch (error) {
		console.error("Error:", error)
		next(error)
		return res.status(500).json({ error: "Failed to fetch the cart." })
	}
})

//increment quantity
router.put("/:customerId/incrementQuantity/:itemId", async (req, res, next) => {
	try {
		const { customerId, itemId } = req.params

		//Find the cart based on the customer's ID
		const cart = await Cart.findOne({ customerId })

		if (!cart) {
			return res.status(404).json({ error: "Cart not found" })
		}

		//Find the item in the cart based on the itemId
		const item = cart.cartItems.find((item) => item.itemId.toString() === itemId)

		if (!item) {
			return res.status(404).json({ error: "Item not found in the cart" })
		}

		//Increment the quantity of the item
		item.quantity++

		// Save the updated cart
		await cart.save()

		return res.status(200).json(cart)
	} catch (error) {
		console.error("Error:", error)
		next(error)
		return res.status(500).json({ error: "Failed to increment item quantity." })
	}
})

//decrement quantity
router.put("/:customerId/decrementQuantity/:itemId", async (req, res, next) => {
	try {
		const { customerId, itemId } = req.params

		//Find the cart based on the customer's ID
		const cart = await Cart.findOne({ customerId })

		if (!cart) {
			return res.status(404).json({ error: "Cart not found" })
		}

		//Find the item in the cart based on the itemId
		const item = cart.cartItems.find((item) => item.itemId.toString() === itemId)

		if (!item) {
			return res.status(404).json({ error: "Item not found in the cart" })
		}

		//Decrement the quantity of the item
		item.quantity--

		//Save the updated cart
		await cart.save()

		return res.status(200).json(cart)
	} catch (error) {
		console.error("Error:", error)
		next(error)
		return res.status(500).json({ error: "Failed to decrement item quantity." })
	}
})

// Remove 1 item from the cart
router.delete("/:userId/:itemId", async (req, res, next) => {
	try {
		const itemId = req.params.itemId

		const cartItemTarget: schema.CartItem = {
			itemId: itemId,
			quantity: 1,
		}

		//Find the cart based on the customer's ID or other criteria
		const userId: String = req.params.userId // Replace this with your actual authentication or request logic

		//Find the cart in the database based on customerId
		const cart = await Cart.findOne({ customerId: { $regex: userId } })

		if (!cart) {
			return res.status(404).json({ error: "Cart not found" })
		}

		//Find and remove the item by its unique identifier within the cart
		const itemIndex = cart.cartItems.findIndex((cartItem) => cartItem.itemId.toString() == cartItemTarget.itemId.toString())

		if (itemIndex === -1) {
			return res.status(404).json({ error: `Item not found in the cart` })
		} else {
			cart.cartItems.splice(itemIndex, 1)
			await cart.save()
			return res.send({ message: "Item Successfully Removed From Cart" })
		}
	} catch (error) {
		next(error)
		return res.status(500).json({ error: "Failed to remove the item from the cart." })
	}
})

//Remove all items from the cart
router.delete("/", async (req, res, next) => {
	try {
		//Find the cart based on the customer's ID
		const customerId = req.body.customerId

		//Find the cart in the database based on customerId
		const cart = await Cart.findOne({ customerId })

		if (!cart) {
			return res.status(404).json({ error: "Cart not found" })
		}

		//Clear all items in the cart
		cart.cartItems = []

		await cart.save()

		// res.status(204).end();
		return res.status(200).json(cart).send({ message: "Cart emptied" })
	} catch (error) {
		next(error)
		return res.status(500).json({ error: "Failed to clear the cart." })
	}
})

router.post("/validateCart/:userId", async (req, res, next) => {
	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		if (!req.params.userId) {
			return next({ message: "Id is required", status: status.BAD_REQUEST })
		}
		const cart = await Cart.findOne({ customerId: { $regex: req.params.userId } })
		if (!cart) {
			return next({ message: "Cart not found", status: status.NOT_FOUND })
		}

		// Checks if the last purchase was on the current week. If true then bad else the user can proceed with their purchase
		let currWeek = false
		const lastPurchase = await CheckoutLog.findOne({ user: req.params.userId }).sort({ date: -1 })
		if (!lastPurchase) {
			currWeek = false
		} else {
			const lastPurchaseDate = new Date(lastPurchase.createdAt)
			currWeek = isCurrentWeek(lastPurchaseDate)
		}

		if (currWeek === true) {
			return next({ message: "You've already made a purhcase this week, Please try again next week.", status: status.BAD_REQUEST })
		}

		// Validates the Cart
		let isValid = false
		let itemsInCategory: { [key: string]: number } = {}
		for (let i = 0; i < cart.cartItems.length; i++) {
			let cartItem = cart.cartItems[i]
			let tempItem = await Items.findById(cartItem.itemId)

			if (!tempItem) {
				return next({ message: "Item not found", status: status.NOT_FOUND })
			}

			if (cartItem.quantity > tempItem.quantity) {
				return next({ message: `Not enough stock for item ${tempItem.name}`, status: status.BAD_REQUEST })
			}

			if (cartItem.quantity > tempItem.deal) {
				return next({ message: `Quantity for item ${tempItem.name} exceeds maximum limit of ${tempItem.deal}`, status: status.BAD_REQUEST })
			}

			const tempCategory = await Categories.findById(tempItem.categoryID)

			if (!tempCategory) {
				return next({ message: "Category not found", status: status.NOT_FOUND })
			}

			itemsInCategory[tempCategory.name] = (itemsInCategory[tempCategory.name] || 0) + cartItem.quantity

			if (itemsInCategory[tempCategory.name] > tempCategory.maxAllowed) {
				return next({
					message: `Quantity for category ${tempCategory.name} of item: (${tempItem.name}) exceeds maximum limit of ${tempCategory.maxAllowed}`,
					status: status.NOT_FOUND,
				})
			}
		}
		isValid = true
		if (isValid) {
			res.send({ message: "Valid Cart" })
		} else {
			res.send({ message: "Invalid Cart", status: FORBIDDEN })
		}
	} catch (e) {
		next(e)
	} finally {
		session.endSession()
	}
})

function isCurrentWeek(date: Date): boolean {
	// This Function assumes that the week starts on Sunday
	const now = new Date()
	now.setHours(0, 0, 0, 0)
	date.setHours(0, 0, 0, 0)

	// Calculate the Sunday of the current week
	const currDayOfWeek = now.getDay()
	const currSunday = new Date(now.valueOf() - currDayOfWeek * 24 * 60 * 60 * 1000)

	// Calculate the Sunday of the provided date's week
	const dateDayOfWeek = date.getDay()
	const dateSunday = new Date(date.valueOf() - dateDayOfWeek * 24 * 60 * 60 * 1000)
	// If true then the last purchase was on the current week else it was on a different week
	return currSunday.getTime() === dateSunday.getTime()
}
