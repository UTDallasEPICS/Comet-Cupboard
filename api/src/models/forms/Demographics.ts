
import { Schema, Document, model } from "mongoose";

export interface IDemographics {
    userID: string;
    numChild: number;
    numParents: number;
    numOld: number;
    income: number;
}

export interface IDemographicsDocument extends IDemographics, Document {
    updatedAt: Date;
  }

const schema = new Schema(
    {
      userID: { type: String, required: true, unique: false },
      numChild: { type: Number, required: true, unique: false },
      numParents: {type: Number, required: true, unique: false},
      numOld: {type: Number, required: true, unique: false},
      income: {type: Number, required: true, unique: false}
    },
    {timestamps: {updatedAt: true}}
  );

export default model <IDemographicsDocument>("Demographic", schema);
  