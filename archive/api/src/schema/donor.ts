import Joi from "joi";
import express from "express";

export interface ICreateDonorSchema extends express.Request{
    body: {
        name: string,
        email: string,
        quantity: number
    };
}

export const CreateDonorSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().lowercase().trim().email(),
        quantity: Joi.number().positive().required()
    })
});