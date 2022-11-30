import Joi from "joi";
import express from "express";

import { MongoIdSchema } from ".";


export interface ICreateWorkerLogSchema extends express.Request {

  body: {
    date?: string
   timeWorked: number;
  };
  params: {
    id: string;
  };
  
  
}
export const CreateWorkerLogSchema = Joi.object({
  body: Joi.object({
    date: Joi.string(),
    timeWorked:Joi.number(),
  }),

  params: MongoIdSchema,
});

