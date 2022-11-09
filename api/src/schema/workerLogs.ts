import Joi from "joi";
import express from "express";

import { MongoIdSchema } from ".";

export interface ICreateWorkerLogSchema extends express.Request {
  query:{
    date?: string;
   };
  body: {
    name: string;
   timeWorked: number;
  };
  params: {
    id: string;
  };
  
  
}
export const CreateWorkerLogSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    timeWorked:Joi.number().required(),
  }),
  query: Joi.object({
    date: Joi.string()
  }),
  params: MongoIdSchema,
});

