import Joi from "joi";
import express from "express";

export interface ICreateItemSchema extends express.Request {
  body: {
    name: string,
    location: string,
    quantity: number,
    size: string,
    image : any,
    deal: {
      type: number,
      default: 1
    }
    categoryID: string
  };
}
export const CreateItemSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    quantity: Joi.number().required(),
    size: Joi.string().required(),
    image: Joi.any(),
    deal : Joi.number().integer().required().default(1),
    categoryID: Joi.string().required()
  })
});