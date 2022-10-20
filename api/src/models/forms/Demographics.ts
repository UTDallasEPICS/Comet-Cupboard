
import { Schema, Document, model } from "mongoose";

export interface INFTB {
    numChild: number;
    numOld: number;
    numIncome: number;
    numParents: number;
}

export interface I_NFTBDocument extends INFTB, Document {
    updatedAt: Date;
  }

const schema = new Schema(
    {
      numChild: { type: Number, required: true, unique: false },
      numOld: {type: Number, required: true, unique: false},
      numIncome: {type: Number, required: true, unique: false},
      numParents: {type: Number, required: true, unique: false}
    },
    {timestamps: {updatedAt: true}}
  );

export default model <I_NFTBDocument>("NFTB", schema);
  