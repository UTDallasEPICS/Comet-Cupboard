
import { Schema, Document, model } from "mongoose";

export interface IDemographic {
    netID: string;
    numChild: number;
    numOld: number;
    numIncome: number;
    numParents: number;
}

export interface IDemographicDocument extends IDemographic, Document {
    updatedAt: Date;
  }

const schema = new Schema(
    {
      netID: { type: String, required: true, unique: false },
      numChild: { type: Number, required: true, unique: false },
      numOld: {type: Number, required: true, unique: false},
      numIncome: {type: Number, required: true, unique: false},
      numParents: {type: Number, required: true, unique: false}
    },
    {timestamps: {updatedAt: true}}
  );

export default model <IDemographicDocument>("Demographic", schema);
  