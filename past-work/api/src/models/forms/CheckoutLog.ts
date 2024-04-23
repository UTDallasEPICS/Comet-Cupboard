//import { string } from "joi";
import { Schema, Document, model } from "mongoose";

export interface ICheckoutLog {
  recipientID: Schema.Types.ObjectId,
  workerID: Schema.Types.ObjectId,
  dateOfCheckout: Date,

   itemIDs: Schema.Types.ObjectId[]
  }
  export interface ICheckoutLogDocument extends ICheckoutLog, Document {
    createdAt: Date;
  }
  
  const schema = new Schema(
    {
      recipientID:  { type: Schema.Types.ObjectId, ref:"User", required: true },
      workerID:  { type: Schema.Types.ObjectId, ref:"Employee", required: true },
        dateOfCheckout: {type: Schema.Types.Date, required: true},
        itemIDs: [{ type: Schema.Types.ObjectId, ref: "Items" }], 
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<ICheckoutLogDocument>("CheckoutLog", schema);