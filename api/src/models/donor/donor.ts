import { Schema, Document, model } from "mongoose";

export interface IDonor {
    name: string,
    email: string,
    quantity: number
}

export interface IDonorDocument extends IDonor, Document{
    createdAt: Date;
    updateAt: Date;
}

const schema = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: false, unique: true},
        quantity: {type: Number, required: true}
    },
    {timestamps: {createdAt: true, updatedAt: true}}
);
//This schema is the blueprint from the api to the database

export default model<IDonorDocument>("Donor", schema);