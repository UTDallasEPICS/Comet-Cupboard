import Joi from "joi";
import express from "express";
import { MongoIdSchema } from ".";

export interface ICreateItemLogSchema extends express.Request {
  body: {
    expDate: string,
    item: string, //objectid
    quantity: number,
    donor: string, //donors
    actionType: string, //Tracking the changes
  };
  params: {
    id: string,
  }
}
export const CreateItemLogSchema = Joi.object({
  body: Joi.object({
    expDate: Joi.string().required(),
    item: Joi.string().required(),
    quantity: Joi.number().required(),
    donor: Joi.string().required(),
    actionType: Joi.string().required()
  }),
  params: MongoIdSchema
  
});