import { Schema, Document, model } from "mongoose";

export interface IWorkerLogs {
    date: string;
    
    //probably have to change this later to use document, but i wasn't sure.
  }
  
  
  const schema = new Schema(
    {
      date: { type: String, required: true, unique: true },
     
    },
   
  );
  
  export default model<IWorkerLogs>("User", schema);