import { Schema, Document, model } from "mongoose";

export interface IItem {
   expDate: string,
   dateIn: string,
   donor: string,
   type: string,
 
  }
  export interface IItemDocument extends IItem, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
      expDate:  { type: String, required: true },
      dateIn: { type: String, required: true },
      donor:{type: String, required: true},
      type: { type: String, required: true }
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<IItemDocument>("Item", schema);