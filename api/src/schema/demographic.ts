import Joi from "joi";
import express from "express";

export interface ICreateDemographicSchema extends express.Request {
    body: {
      netID: string;
      numChild: number;
      numOld: number;
      numIncome: number;
      numParents: number;
    };
  }

  export const CreateDemographicSchema = Joi.object({
    body: Joi.object({
      netID: Joi.string().required().max(9).min(9),
      numChild: Joi.number().required(),
      numOld: Joi.number().required(),
      numIncome: Joi.number().required(),
      numParents: Joi.number().required(),
    })
});