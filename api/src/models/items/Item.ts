import { Schema, Document, model } from "mongoose";

export interface IItems {
   name: string,
   location: string,
   quantity: string,
   //arrayOfItem

    
  }
  export interface IItemsDocument extends IItems, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
      name:  { type: String, required: true },
      location: { type: String, required: true },
      quantity:{type: String, required: true}
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<IItemsDocument>("Item", schema);