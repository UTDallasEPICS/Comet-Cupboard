import { Schema, Document, model } from "mongoose";

export interface IItems {
   name: string,
   location: string,
   quantity: number,
   size: string   
  }
  export interface IItemsDocument extends IItems, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
      name: { type: String, required: true },
      location: {type: String, required: true},
      quantity: {type: Number, required: true},
      size: { type: String, required: true}
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<IItemsDocument>("Items", schema);