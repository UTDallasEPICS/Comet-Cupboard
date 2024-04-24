import express from "express"
import { getItems, getItemsByCategory } from "../db/item/item";

export const getAllItems = async (req: express.Request, res: express.Response) => {
    const details = await getItems; 
    return res.status(200).json(details).end();
}

export const getOnlyCategory = async (req: express.Request, res: express.Response) => {
    const details = await getItemsByCategory;
    return res.status(200).json(details).end();
}