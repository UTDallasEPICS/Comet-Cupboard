import { Schema, Document, model } from "mongoose";
import { IUser } from "..";


export interface IWorkerLogs {
    date: string;
    items: IUser[];
    //probably have to change this later to use document, but i wasn't sure.
  }
  
  
  const schema = new Schema(
    {
      date: { type: String, required: true, unique: true },
     
    },
   
  );
  
  export default model<IWorkerLogs>("User", schema);