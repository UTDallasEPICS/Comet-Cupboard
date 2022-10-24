import { Schema, Document, model } from "mongoose";

export interface IItems {
   expDate: string,
   dateIn: string,
   donor: string,
 
  }
  export interface IItemsDocument extends IItems, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
      expDate:  { type: String, required: true },
      dateIn: { type: String, required: true },
      donor:{type: String, required: true}
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<IItemsDocument>("Item", schema);