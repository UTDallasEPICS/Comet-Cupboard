
//import { number } from "joi";
import { Schema, Document, model } from "mongoose";

export interface IEmployee {
    netID: String,
    password: String,
    timeWorked: Number,
    firstName: String,
    lastName: String
  }
  
  export interface IEmployeeDocument extends IEmployee, Document {
    createdAt: Date;
    updatedAt: Date;
  }
  
  const schema = new Schema(
    {
      netID: { type: String, required: true, unique: true },
      password: {type: String, required: true},
      timeWorked: {type: Number, required: false},
      firstName: {type: String, required: true},
      lastName: {type: String, required: true}
    },
    { timestamps: { createdAt: true, updatedAt: true } }
  );
  
  export default model<IEmployeeDocument>("Employee", schema);