
import { Schema, Document, model } from "mongoose";

export interface IDemographics {
    userID: Schema.Types.ObjectId;
    ageCategory: number;

    countChild: number;
    countParents: number;
    countSeniors: number;

    snapInterest: boolean;
    // firstName: string;
    // lastName: string;

    income: number;
}

export interface IDemographicsDocument extends IDemographics, Document {
    updatedAt: Date;
  }

const schema = new Schema(
    {
      userID: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: false },
      ageCategory: { type: Number, required: true, unique: false },

      countChild: { type: Number, required: true, unique: false },
      countParents: {type: Number, required: true, unique: false},
      countSeniors: {type: Number, required: true, unique: false},

      snapInterest: {type: Boolean, required: true, unique: false},
      // firstName: {type: String, required: true, unique: false},
      // lastName: {type: String, required: true, unique: false},

      income: {type: Number, required: true, unique: false}
    },
    {timestamps: {updatedAt: true}}
  );

export default model <IDemographicsDocument>("Demographic", schema);
  