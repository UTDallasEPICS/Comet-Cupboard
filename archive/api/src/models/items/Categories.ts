import { Schema, Document, model } from "mongoose";

export interface ICategory {
   name: string,
   description: string,
   color: string,
   maxAllowed: number,
  }
  export interface ICategoryDocument extends ICategory, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
      name: { type: String, required: true },
      description: {type: String, required: true},
      color: {type: String, required: true},
      maxAllowed: {type: Number, required: true, default : 1}
      
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<ICategoryDocument>("Category", schema);