import Joi from "joi";
import express from "express";

export interface ICreateDemographicsSchema extends express.Request {
    body: {
      netID: string;
      numChild: number;
      numParents: number;
      numOld: number;
      income: number;
    };
  }

  export const CreateDemographicsSchema = Joi.object({
    body: Joi.object({
      netID: Joi.string().required().max(9).min(9),
      numChild: Joi.number().required(),
      numParents: Joi.number().required(),
      numOld: Joi.number().required(),
      income: Joi.number().required()
    })
});