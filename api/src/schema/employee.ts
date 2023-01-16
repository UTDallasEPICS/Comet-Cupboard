import Joi from "joi";
import express from "express";
import { MongoIdSchema } from ".";

export interface ICreateEmployeeSchema extends express.Request {
  body: {
    netID: string;
    password: string;
    //array later, not sure 
  };
  params: {
    id: string;
  }
}
export const CreateEmployeeSchema = Joi.object({
  body: Joi.object({
    netID: Joi.string().required().lowercase().trim().min(9).max(9),
    password: Joi.string().required(),
  }),
  params: MongoIdSchema,
});