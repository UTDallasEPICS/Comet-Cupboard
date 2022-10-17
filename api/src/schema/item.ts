import Joi from "joi";
import express from "express";

export interface ICreateItemSchema extends express.Request {
  body: {
    expDate: string;
    donor: string;
   
  };
}
export const CreateEmployeeSchema = Joi.object({
  body: Joi.object({
    expDate: Joi.string().required(),
    donor: Joi.string().required(),
  })
});