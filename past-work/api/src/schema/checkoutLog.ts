import Joi from "joi";
import express from "express";
//import { MONGO_ID_REGEX } from ".";

export interface ICreateCheckoutLogSchema extends express.Request {
    body: {
        dateOfCheckout: string;
        recipientID: string;
        workerID: string;
        itemIDs: string[]; 
    };
    params:{
        id: string
    }
}

export const CreateCheckoutLogSchema = Joi.object({
    body: Joi.object({
        dateOfCheckout: Joi.string().required(),
        recipientID: Joi.string().required(),
        workerID: Joi.string().required(),
        itemIDs: Joi.array().items(Joi.string()) //.required()
    }),
    // params: Joi.object({
    //     id: Joi.string().required().regex(MONGO_ID_REGEX)
    //     })
});