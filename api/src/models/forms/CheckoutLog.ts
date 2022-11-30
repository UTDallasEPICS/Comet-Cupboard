
import { Schema, Document, model } from "mongoose";

export interface ICheckoutLog {
   recipientID: Schema.Types.ObjectId,
   workerID: string,
   dateOfCheckout: string,
 
  }
  export interface ICheckoutLogDocument extends ICheckoutLog, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
        recipientID:  { type: Schema.Types.ObjectId, ref:"User", required: true },
        itemLogs:  { type: String, required: true },
        workerID:  { type: String, required: true },
        dateOfCheckout: {type: String, required: true}
      
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<ICheckoutLogDocument>("CheckoutLog", schema);