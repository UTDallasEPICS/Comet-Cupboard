import Joi from "joi";
import express from "express";

export const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export function validate(schema: Joi.ObjectSchema) {
  return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const { value, error } = schema.validate(req, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });
    if (error) throw error;

    req.params = value.params;
    req.body = value.body;
    req.query = value.query;
    return next();
  };
}

export interface IMongoIdSchema extends express.Request {
  params: {
    id: string;
  };
}
export const MongoIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().regex(MONGO_ID_REGEX)
  })
});