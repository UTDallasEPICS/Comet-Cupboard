import Joi from "joi";
import express from "express";
import { Schema } from "mongoose";
//import { CreateItemSchema } from "./items"; // Assuming this is the correct import

// Define a type for your cart item
export type CartItem = {
  itemId: Schema.Types.ObjectId;
  quantity: number;
  //size: string;
  categoryId: string;
};

// Define the cart schema
export interface ICreateCartSchema extends express.Request {
  body: {
    customerId: string;
    cartItems: CartItem[];
  };
}

export const CreateCartSchema = Joi.object({
  body: Joi.object({
    customerId: Joi.string().required(),
    cartItems: Joi.array()
      .items(
        Joi.object({
          itemId: Joi.string().required(),
          quantity: Joi.number().required(),
          categoryId: Joi.string().required(),
        })
      )
  })
});

export const AddCartItemSchema = Joi.object({
  body: Joi.object({
    cartItem: Joi.object({
      itemId: Joi.string().required(),
      quantity: Joi.number().required(),
      categoryId: Joi.string().required(),
    }),
  }),
});

export const AddCartItemSchema2 = Joi.object({
  itemId: Joi.string().required(), 
  quantity: Joi.number().required(),
  categoryId: Joi.string().required(), 
});




