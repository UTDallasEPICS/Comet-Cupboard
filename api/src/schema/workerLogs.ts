import Joi from "joi";
import express from "express";

export interface ICreateWorkerLog extends express.Request {
  body: {
   date: string;
    
  };
}
export const CreateWorkerLog = Joi.object({
  body: Joi.object({
    date: Joi.string().required(),
  })
});