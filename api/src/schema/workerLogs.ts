import Joi from "joi";
import express from "express";

export interface ICreateWorkerLogSchema extends express.Request {
  body: {
    name: string
   timeworked: number;
  };
}
export const CreateWorkerLogSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    timeWorked:Joi.number().required(),
  })
});