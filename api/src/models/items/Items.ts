import { Schema, Document, model } from "mongoose";
import { IItem } from "./Item(Individual)";

export interface IItems {
   name: string,
   location: string,
   quantity: string,
   items: IItem[];
    
  }
  export interface IItemsDocument extends IItems, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
      name: { type: String, required: true },
      location: {type: String, required: true},
      quantity: {type: String, required: true},
      items: {type: String, required: true}

      
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<IItemsDocument>("Category", schema);