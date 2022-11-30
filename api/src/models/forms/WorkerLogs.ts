import { Schema, Document, model, Date } from "mongoose";


export interface IWorkerLogs{
    employeeID: Schema.Types.ObjectId;
    timeWorked: number;
    date: Date
   
  }

export interface IWorkerLogsDocument extends IWorkerLogs, Document {
   createdAt: Date;
}
  
  const schema = new Schema(
    {
      employeeID: {type: Schema.Types.ObjectId, ref:"Employee", required: true, unique: false},
      timeWorked: {type: Number, required:true, unique: false},
      date:{type: String, required:true, unique: false}
    },
    { timestamps: { createdAt: true} },
   
  );
  
  export default model<IWorkerLogsDocument>("WorkerLogs", schema);