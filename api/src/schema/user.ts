import Joi from "joi";
import express from "express";

export interface ICreateUserSchema extends express.Request {
  body: {
    netID: string;
    
  };
}
export const CreateUserSchema = Joi.object({
  body: Joi.object({
    netID: Joi.string().required().lowercase().trim().min(9).max(9),
    
  })
});