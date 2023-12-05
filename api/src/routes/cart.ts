import express from "express";
import status from "http-status";
import { validate as validateSchema} from "../schema";
import * as schema from "../schema/cart";
// const Cart = require("../models")
import { Cart } from "../models";
import { Schema } from "mongoose";
import { get } from "lodash";
// import mongoose, { Schema, Document, model } from "mongoose";


export const router = express.Router();

router.post("/", validateSchema(schema.CreateCartSchema), async (req, res, next) => {
  try {
    const { customerId, cartItems  } = req.body;
    const newCart = new Cart({ customerId, cartItems  });
    await newCart.save();
    res.status(201).send({ message: "Successfully created a cart" });
  } catch (error) {
    res.status(500).json({ error: 'Could not create the cart.' });
    next(error);
  }
});


router.post("/addItem/:userId", async (req, res, next) => {
  try {
    if (!req.params.userId) {
      return next({ message: "Id is required", status: status.BAD_REQUEST });
    }
    //Find the cart based on the customer's ID
    const cart = await Cart.findOne({"customerId":{'$regex': req.params.userId}});

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const newItem = req.body;
    
    //Add the item to the cart's cartItems array
    cart.cartItems.push(newItem);

    //Save the updated cart
    await cart.save();

    return res.status(201).json(cart).send({message: "Item added"}); 
  } catch (error) {
    console.error('An error occurred:', error);
    return next(error); 
  }
});

router.get("/:customerId", async (req, res, next) => {
  try {
    const customerId = req.params.customerId;

    // Find the cart based on the customer's ID
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error:", error);
    next(error);
    return res.status(500).json({ error: "Failed to fetch the cart." });
    
  }
});


//increment quantity
router.put("/:customerId/incrementQuantity/:itemId", async (req, res, next) => {
  try {
    const { customerId, itemId } = req.params;

    //Find the cart based on the customer's ID
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    //Find the item in the cart based on the itemId
    const item = cart.cartItems.find((item) => item.itemId.toString() === itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found in the cart" });
    }

    //Increment the quantity of the item
    item.quantity++;

    // Save the updated cart
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error:", error);
    next(error);
    return res.status(500).json({ error: "Failed to increment item quantity." });
  }
});

//decrement quantity
router.put("/:customerId/decrementQuantity/:itemId", async (req, res, next) => {
  try {
    const { customerId, itemId } = req.params;

    //Find the cart based on the customer's ID
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    //Find the item in the cart based on the itemId
    const item = cart.cartItems.find((item) => item.itemId.toString() === itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found in the cart" });
    }

    //Decrement the quantity of the item
    item.quantity--;

    //Save the updated cart
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error:", error);
    next(error);
    return res.status(500).json({ error: "Failed to decrement item quantity." });
  }
});

// Remove 1 item from the cart
router.delete("/:itemId", async (req, res, next) => {
  try {
    const  itemId = get(req,"body.itemId") as Schema.Types.ObjectId;
    // const cartItemTarget = new cartItems();

    const cartItemTarget: schema.CartItem = {
        itemId: itemId,
        quantity: 1,
        categoryId: ""
    };
      



    //Find the cart based on the customer's ID or other criteria
    const customerId = req.body.customerId; // Replace this with your actual authentication or request logic

    //Find the cart in the database based on customerId
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({error: "Cart not found"});
    }

    //Find and remove the item by its unique identifier within the cart
    const itemIndex = cart.cartItems.findIndex((cartItem) => cartItem.itemId == cartItemTarget.itemId);

    
    if (itemIndex === -1) {
      return res.status(404).json({error: "Item not found in the cart"});
    } else {
        cart.cartItems.splice(itemIndex, 1);
        await cart.save();

        return res.status(204).end();
    }
  } catch (error) {

    next(error);
    return res.status(500).json({ error: "Failed to remove the item from the cart." });
    
  }
});

//Remove all items from the cart
router.delete("/", async (req, res, next) => {
  try {
    //Find the cart based on the customer's ID 
    const customerId = req.body.customerId; 

    //Find the cart in the database based on customerId
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    //Clear all items in the cart
    cart.cartItems = [];
    
    await cart.save();

    // res.status(204).end();
    return res.status(204).json(cart).send({message: "Cart emptied"}); 

  } catch (error) {
    next(error);
    return res.status(500).json({ error: "Failed to clear the cart." });
  }
});

