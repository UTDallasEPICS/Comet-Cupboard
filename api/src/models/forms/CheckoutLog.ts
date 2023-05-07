
import { Schema, Document, model } from "mongoose";

export interface ICheckoutLog {
   recipientID: Schema.Types.ObjectId,
   workerID: Schema.Types.ObjectId,
   dateOfCheckout: string
  }
  export interface ICheckoutLogDocument extends ICheckoutLog, Document {
    createdAt: Date;
  }
  
  const schema = new Schema(
    {
        recipientID:  { type: Schema.Types.ObjectId, ref:"User", required: true },
        workerID:  { type: Schema.Types.ObjectId, ref:"Employee", required: true },
        dateOfCheckout: {type: String, required: true}
      
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<ICheckoutLogDocument>("CheckoutLog", schema);