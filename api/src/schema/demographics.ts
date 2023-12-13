import Joi from "joi";
import express from "express";

export interface ICreateDemographicsSchema extends express.Request {
    body: {
      userID: string;
      ageCategory: number;

      countChild: number;
      countParents: number;
      countSeniors: number;

      snapInterest: boolean;
      // Boolean value for whether or not the user is interested in SNAP benefits

      // firstName: string;
      // lastName: string;

      income: number;
    };
  }

  export const CreateDemographicsSchema = Joi.object({
    body: Joi.object({
      userID: Joi.string().required(),
      ageCategory: Joi.number().required().min(1).max(3),
      //^This variable acts like a 3-way boolean. Key:
      // 1 - User is <17
      // 2 - User is 18 - 59 years old
      // 3 - User is 60 or older

      countChild: Joi.number().required(),
      countParents: Joi.number().required(),
      countSeniors: Joi.number().required(),

      snapInterest: Joi.boolean(),
      // firstName: Joi.string().required(),
      // lastName: Joi.string().required(),
      
      income: Joi.number().required()
    })
});