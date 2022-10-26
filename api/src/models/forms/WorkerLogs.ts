import { Schema, Document, model } from "mongoose";



export interface IWorkerLogsDocument extends Document{
    date: string;
    timeWorked: number
    //probably have to change this later to use document, but i wasn't sure.
  }
  
  
  const schema = new Schema(
    {
      date: { type: String, required: true, unique: true },
      timeworked: {type: Number, required:true, unique: false},
     
    },
   
  );
  
  export default model<IWorkerLogsDocument>("User", schema);