import { cartItem } from './../models/cart/cart';
import express from "express";
import status, { FORBIDDEN } from "http-status";
import { validate as validateSchema} from "../schema";
import * as schema from "../schema/cart";
import { Cart, CheckoutLog, Items } from "../models";
import Categories from '../models/items/Categories';
export const router = express.Router();
import mongoose from 'mongoose'

router.post("/addItem/:userId", validateSchema(schema.CreateCartSchema), async (req : schema.ICreateCartItemSchema, res, next) => {
  try {
    if (!req.params.userId) {
      return next({ message: "Id is required", status: status.BAD_REQUEST });
    }
    //Find the cart based on the customer's net ID
    const cart = await Cart.findOne({"customerId":{'$regex': req.params.userId}});
    if (!cart) {
      return next({ message: "Cart not found", status: status.NOT_FOUND });
    }

    const tempItem = await Items.findOne({_id: req.body.itemId});
    if(!tempItem) 
    {
      return next({ message: "Could not find item", status: status.NOT_FOUND });
    }

    if(tempItem.quantity <= 0)
    {
      return next({ message: "Sorry but this item is no longer in stock. Please try again later", status: status.FORBIDDEN });
    }

    if(tempItem.quantity <= req.body.quantity)
    {
      return next ({ message : "The amount you requested currently isn't available, Please try lowering the amount or trying again later.", status : status.FORBIDDEN})
    }

    let inCart = false;
    cart.cartItems.forEach((cItem) => {
      if (tempItem._id.equals(cItem.itemId))
      {
        inCart = true;
      }
    })

    if(!inCart)
    {
      const newCartItem = new cartItem({
        itemId : req.body.itemId,
        quantity : req.body.quantity
      })
      cart.cartItems.push(newCartItem);
      await cart.save();
      res.send({ message: "Item Successfully Added To Cart" });
    }
    else
    {
      for(let i = 0; i < cart.cartItems.length; i++)
      {
        let cartItem = cart.cartItems[i];
        if(tempItem._id.equals(cartItem.itemId))
        {
          if(cartItem.quantity + req.body.quantity <= tempItem.deal)
          {
            cartItem.quantity += req.body.quantity;
            await cart.save();
            res.send({ message: "Item Successfully Added To Cart" });
          }
          else
          {
            return next ({ message : `The amount you've requested to add exceeds the maximum amount allowed (${tempItem.deal}) for the item "${tempItem.name}". Please try lowering the amount or trying again later.`, status : status.FORBIDDEN})
          }
        } 
      }
    }
    
  } catch (e) {
    next(e)
  }
});


router.post("/validateCart/:userId", async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    if (!req.params.userId) {
      return next({ message: "Id is required", status: status.BAD_REQUEST });
    }
    const cart = await Cart.findOne({"customerId":{'$regex': req.params.userId}});
    if (!cart) {
      return next({ message: "Cart not found", status: status.NOT_FOUND });
    }

    // Checks if the last purchase was on the current week. If true then bad else the user can proceed with their purchase
    let currWeek = false;
    const lastPurchase = await CheckoutLog.findOne({ user: req.params.userId }).sort({ date: -1 });
    if (!lastPurchase) {
      currWeek = false;
    }
    else
    {
      const lastPurchaseDate = new Date(lastPurchase.createdAt);
      currWeek = isCurrentWeek(lastPurchaseDate);
    }

    if(currWeek === true)
    {
      return next({ message: "You've already made a purhcase this week, Please try again next week.", status: status.BAD_REQUEST });
    }

  // Validates the Cart
  let isValid = false;
  let itemsInCategory: { [key: string]: number } = {}
  for(let i = 0; i < cart.cartItems.length; i++)
  {
    let cartItem = cart.cartItems[i];
    let tempItem = await Items.findById(cartItem.itemId);
    
    if(!tempItem) 
    {
      return next({ message: "Item not found", status: status.NOT_FOUND });
    }

    if (cartItem.quantity > tempItem.quantity)
    {
      return next({ message: `Not enough stock for item ${tempItem.name}`, status: status.BAD_REQUEST });
    }

    if(cartItem.quantity > tempItem.deal)
    {
      return next({ message: `Quantity for item ${tempItem.name} exceeds maximum limit of ${tempItem.deal}`, status: status.BAD_REQUEST });
    }

    let tempCategory = await Categories.findById(tempItem.categoryID);
    
    if(!tempCategory) 
    {
      return next({ message: "Category not found", status: status.NOT_FOUND });
    }

    if (itemsInCategory[tempCategory.name]) {
      itemsInCategory[tempCategory.name] += cartItem.quantity;
    } 
    else {
      itemsInCategory[tempCategory.name] = cartItem.quantity;
    }

    if (itemsInCategory[tempCategory.name] > tempCategory.maxAllowed) {
      return next({ message: `Quantity for category ${tempCategory.name} of item: (${tempItem.name}) exceeds maximum limit of ${tempCategory.maxAllowed}`, status: status.NOT_FOUND });
    }
  }
  isValid = true;
  if(isValid){
    res.send({ message: "Valid Cart" });
  }
  else
  {
    res.send({ message: "Invalid Cart", status: FORBIDDEN });
  }
  }
  catch(e)
  {
    next(e);
  }
  finally {
    session.endSession();
  }
})

function isCurrentWeek(date: Date): boolean {
  // This Function assumes that the week starts on Sunday
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  // Calculate the Sunday of the current week
  const currDayOfWeek = now.getDay();
  const currSunday = new Date(now.valueOf() - currDayOfWeek * 24*60*60*1000);

  // Calculate the Sunday of the provided date's week
  const dateDayOfWeek = date.getDay();
  const dateSunday = new Date(date.valueOf() - dateDayOfWeek * 24*60*60*1000);
  // If true then the last purchase was on the current week else it was on a different week
  return currSunday.getTime() === dateSunday.getTime();
}
