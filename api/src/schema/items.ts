import Joi from "joi";
import express from "express";

export interface ICreateItemSchema extends express.Request {
  body: {
    name: string,
    location: string,
    quantity: number,
    size: string  
  };
}
export const CreateItemSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    quantity: Joi.number().required(),
    size: Joi.number().required()
  })
});