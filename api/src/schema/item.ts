import Joi from "joi";
import express from "express";

export interface ICreateItemSchema extends express.Request {
  body: {
    expDate: string,
    item: string, //objectid
    quantity: string,
    donor: string, //donors
    actionType: string, //Tracking the changes
  };
}
export const CreateItemSchema = Joi.object({
  body: Joi.object({
    expDate: Joi.string().required(),
    item: Joi.string().required(),
    quantity: Joi.string().required(),
    donor: Joi.string().required(),
    actionType: Joi.string().required()
  })
});