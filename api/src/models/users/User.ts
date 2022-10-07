import { Schema, Document, model } from "mongoose";

export interface IUser {
  netID: string;
  numChild: Number;
  numParent: Number;
  numElderly: Number;
  familyIncome: Number;
  
}
export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema(
  {
    netID: { type: String, required: true, unique: true },
    numChild: { type: Number, required: true },
    numParent: { type: Number, required: true },
    numElderly: { type: Number, required: true },
    familyIncome: { type: Number, requried: true}
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default model<IUserDocument>("User", schema);