import Joi from "joi";
import express from "express";
// import { MONGO_ID_REGEX } from ".";
export interface ICreateItemLogSchema extends express.Request {
  body: {
    checkoutID: string,
    workerID: string,
    expDate: string,
    item: string, //objectid
    quantity: number,
    donor: string, //donors
    actionType: string, //Tracking the changes
    hasExpired: boolean, // Marks an item as expired
    newDate: string
  },
  params: {
    id: string;
  };
}

export const CreateItemLogSchema = Joi.object({
  body: Joi.object({
    checkoutID: Joi.string(),
    workerID: Joi.string().required(),
    expDate: Joi.string(),
    item: Joi.string().required(),
    quantity: Joi.number().required(),
    donor: Joi.string().required(),
    actionType: Joi.string().required(),
    hasExpired: Joi.boolean().default(false),
    newDate: Joi.string()
  }),
  // params: Joi.object({
  //   id: Joi.string().required().regex(MONGO_ID_REGEX)
  //   })
});