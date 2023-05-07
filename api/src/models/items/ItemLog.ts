import { Schema, Document, model } from "mongoose";
// Could be intake, checkout, removing expired items, or something else
export interface IItemLog {
   checkoutID: Schema.Types.ObjectId,
   expDate: string,
   item: Schema.Types.ObjectId, //objectid
   quantity: number,
   donor: Schema.Types.ObjectId, //donors
   actionType: string //Tracking the changes
  }
  export interface IItemLogDocument extends IItemLog, Document {
    createdAt: Date;
  }
  
  const schema = new Schema(
    {
      checkoutID: { type: Schema.Types.ObjectId, ref: "CheckoutLog", required: true },
      expDate: { type: String, required: true },
      item: {type: Schema.Types.ObjectId, ref: "Items", required: true},
      quantity:{type: Number, required: true},
      donor:{type: Schema.Types.ObjectId, ref: "Donor", required: true},
      actionType:{type: String, required: true}
    },
    
    { timestamps: { createdAt: true } }
  );
  
  export default model<IItemLogDocument>("ItemLog", schema);