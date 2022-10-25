
import { Schema, Document, model } from "mongoose";
import { IItemLog } from "../items/ItemLog";

export interface ICheckoutLog {
   recipientID: string,
   itemLogs: IItemLog[];
   workerID: string,
   dateOfCheckout: string,
 
  }
  export interface ICheckoutLogDocument extends ICheckoutLog, Document {
    createdAt: Date;
    
  }
  
  const schema = new Schema(
    {
        recipientID:  { type: String, required: true },
        itemLogs:  { type: String, required: true },
        workerID:  { type: String, required: true },
        dateOfCheckout: {type: String, required: true}
      
    },
    { timestamps: { createdAt: true } }
  );
  
  export default model<ICheckoutLogDocument>("Item", schema);