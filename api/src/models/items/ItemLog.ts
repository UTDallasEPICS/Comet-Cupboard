import { Schema, Document, model } from "mongoose";
// Could be intake, checkout, removing expired items, or something else
export interface IItemLog {
   expDate: string,
   item: string, //objectid
   quantity: number,
   donor: string, //donors
   actionType: string, //Tracking the changes
 
  }
  export interface IItemLogDocument extends IItemLog, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
      expDate: { type: String, required: true },
      item: {type: String, required: true},
      quantity:{type: Number, required: true},
      donor:{type: String, required: true},
      actionType:{type: String, required: true}
    },
    
    { timestamps: { createdAt: true } }
  );
  
  export default model<IItemLogDocument>("ItemLog", schema);