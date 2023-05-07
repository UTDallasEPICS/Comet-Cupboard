import Joi from "joi";
import express from "express";

import {  MONGO_ID_REGEX } from ".";


export interface ICreateWorkerLogSchema extends express.Request {
  body: {
   timeWorked: number,
   employeeID: String,
  };
  params: {
    id: string;
  };
  
}
export const CreateWorkerLogSchema = Joi.object({
  body: Joi.object({
    timeWorked:Joi.number(),
    employeeID: Joi.string().required()
  }),

  params: Joi.object({ 
    id: Joi.string().required().regex(MONGO_ID_REGEX)
  })
});

