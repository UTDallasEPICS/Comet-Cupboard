import Joi from "joi";
import express from "express";

export interface ICreateCategorySchema extends express.Request {
  body: {
    name: string,
    description: string,
    color: string
    maxAllowed: {
      type: number,
      default: 1
    }
  };
}
export const CreateCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    color: Joi.string().required(),
    maxAllowed : Joi.number().default(1),
  })
});