import { Schema, Document, model } from "mongoose"; //Where objects are defined

export interface IUser {
  netID: string;
  
  
}
export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema(
  {
    netID: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default model<IUserDocument>("User", schema);