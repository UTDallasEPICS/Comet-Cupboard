import Joi from "joi";
import express from "express";

export interface ICreateNFTBSchema extends express.Request {
    body: {
      numChild: number;
      numOld: number;
      numIncome: number;
      numParents: number;
    };
  }

  export const CreateNFTBSchema = Joi.object({
    body: Joi.object({
        numChild: Joi.number().required(),
        numOld: Joi.number().required(),
        numIncome: Joi.number().required(),
        numParents: Joi.number().required(),
    })
});