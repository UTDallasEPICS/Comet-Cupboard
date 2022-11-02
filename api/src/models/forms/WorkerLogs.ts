import { Schema, Document, model } from "mongoose";



export interface IWorkerLogs{
    name: string;
    timeWorked: number
    //probably have to change this later to use document, but i wasn't sure.
  }

export interface IWorkerLogsDocument extends IWorkerLogs, Document {
   createdAt: Date;
}
  
  const schema = new Schema(
    {
      name: {type: String, required: true, unique: false},
      timeWorked: {type: Number, required:true, unique: false},
    },
    { timestamps: { createdAt: true} },
   
  );
  
  export default model<IWorkerLogsDocument>("WorkerLogs", schema);