import Joi from "joi";
import express from "express";

export interface ICreateUserSchema extends express.Request {
  body: {
    netID: string;
    numChild: Number;
    numParent: Number;
    numElderly: Number;
    familyIncome: Number;
  };
}
export const CreateUserSchema = Joi.object({
  body: Joi.object({
    netID: Joi.string().required().lowercase().trim().min(9).max(9),
    numChild: Joi.number().required(),
    numParent: Joi.number().required(),
    numElderly: Joi.number().required(),
    familyIncome: Joi.number().required()
  })
});