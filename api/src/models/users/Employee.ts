
import { Schema, Document, model } from "mongoose";

export interface IEmployee {
    netID: string;
    password: string
    
    
  }
  export interface IEmployeeDocument extends IEmployee, Document {
    createdAt: Date;
    updatedAt: Date;
  }
  
  const schema = new Schema(
    {
      netID: { type: String, required: true, unique: true },
      password:{type: String, required: true, unique: true}
    },
    { timestamps: { createdAt: true, updatedAt: true } }
  );
  
  export default model<IEmployeeDocument>("User", schema);