//Route endpoint for all things related to Employee
import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/employee";
import { Employee, WorkerLogs } from "../models";



export const router = express.Router();

//NetID
router.post("/", validateSchema(schema.CreateEmployeeSchema), async (req: schema.ICreateEmployeeSchema, res, next) => {
    try {
      const existingUser = await Employee.findOne({ netID: req.body.netID });
      if (existingUser) {
        return next({
          message: "Account already exists",
          status: status.BAD_REQUEST
        });
      }
      const employee = new Employee({
        netID: req.body.netID, 
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });
      await employee.save();
      // remember to send a response back to whoever is requesting or else it will infinitely wait
      res.send({ message: "Successfully created account!", id: employee._id });
    } catch (e) {
      next(e);
    }
  });
    
    // get all accounts
    router.get("/", async (req, res, next) => {
      try{
        const employees = await Employee.find();
        res.send({ accounts: employees});
      } catch(e){
        next(e);
      }
    });

  //update route
  router.put("/", validateSchema(schema.CreateEmployeeSchema), async ( req: schema.ICreateEmployeeSchema, res, next) => {
    try{
      const existingEmployee = await Employee.findOne({ netID: req.body.netID });
      if(!existingEmployee){
        return next({
          message: "Employee does not exist",
          status: status.BAD_REQUEST
        });
      }
      await Employee.findOneAndUpdate({
        netID: req.body.netID
      },
      {
        netID: req.body.netID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
      },
      {
        new: true
      } 
    );
    res.send({ message: "Information Updated"});
    }catch(e){
      next(e);
    }
  });

    //get one account//
    //!!! This route currently does not work, to fix later (does not return any data, though it doesn't break)//
    router.get("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
      try {
        if(!req.params.id){
          return next({ message: "netID is required", status: status.BAD_REQUEST});
        }
          const employee = await Employee.findOne({_id: req.params.id});
          if(!employee){
            return next({
              message: "Account not found",
              status: status.BAD_REQUEST
            });
          }
          const logs = await WorkerLogs.find({ _id: req.params.id});
          let sum = 0;
          for(var i = 0; i < logs.length; i++){
            let log = logs.at(i);
            if(log?.timeWorked){
              sum += log.timeWorked;
            }
          }
          employee.timeWorked = sum;
          res.send({ employee: employee});
      } catch (e) {
        next(e);
      }
    });

    // delete new account
    router.delete("/:id", validateSchema(MongoIdSchema), async (req, res, next) => {
      try {
      if (!req.params.id) {
        return next({ message: "Id is required", status: status.BAD_REQUEST });
      }
      await Employee.deleteOne({ _id: req.params.id });
  
      res.send({ message: "Successfully deleted account" });
    } catch (e) {
      next(e);
    }
  });


