import { Schema, Document, model } from "mongoose";

export interface ICategory {
   name: string,
   description: string,
   color: string,
    
  }
  export interface ICategoryDocument extends ICategory, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
      name: { type: String, required: true },
      description: {type: String, required: true},
      color: {type: String, required: true}
      
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<ICategoryDocument>("Category", schema);