import Joi from "joi";
import express from "express";
import { MONGO_ID_REGEX } from ".";
export interface ICreateItemLogSchema extends express.Request {
  body: {
    checkoutID: string,
    expDate: string,
    item: string, //objectid
    quantity: number,
    donor: string, //donors
    actionType: string //Tracking the changes
  },
  params: {
    id: string;
  };
}

export const CreateItemLogSchema = Joi.object({
  body: Joi.object({
    checkoutID: Joi.string().required(),
    expDate: Joi.string().required(),
    item: Joi.string().required(),
    quantity: Joi.number().required(),
    donor: Joi.string().required(),
    actionType: Joi.string().required()
  }),
  params: Joi.object({
    id: Joi.string().required().regex(MONGO_ID_REGEX)
    })
});