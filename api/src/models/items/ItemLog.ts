import { Schema, Document, model } from "mongoose";

export interface IItemLog {
   quantityTaken: string,
   items: IItemLog[];
   
 
  }
  export interface IItemLogDocument extends IItemLog, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
      quantityTaken:  { type: String, required: true },
      items: {type: String, required: true}
      
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<IItemLogDocument>("Item", schema);