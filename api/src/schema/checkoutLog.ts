import Joi from "joi";
import express from "express";
// import { MONGO_ID_REGEX } from ".";

export interface ICreateCheckoutLogSchema extends express.Request {
    body: {
        dateOfCheckout: string,
        recipientID: string,
        workerID: string
    };
    params:{
        id: string
    }
}

export const CreateCheckoutLogSchema = Joi.object({
    body: Joi.object({
        dateOfCheckout: Joi.string().required(),
        recipientID: Joi.string().required(),
        workerID: Joi.string().required()
    }),
    // params: Joi.object({
    //     id: Joi.string().required().regex(MONGO_ID_REGEX)
    //     })
});