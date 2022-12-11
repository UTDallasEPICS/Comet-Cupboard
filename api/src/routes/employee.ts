//Route endpoint for all things related to Employee
import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema } from "../schema";
import * as schema from "../schema/employee";
import { Employee } from "../models";



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
        password: req.body.password
        
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
        try {
          
          const employeeInformation = await Employee.aggregate([
            {
              '$lookup': {
                'from': 'workerlogs', 
                'localField': '_id', 
                'foreignField': 'employeeID', 
                'as': 'employeeData'
              }
            }, {
              '$project': {
                'netID': '$netID', 
                'totalHours': {
                  '$sum': '$employeeData.timeWorked'
                }
              }
            }
          ])
        
          
      
          res.send({ employeeData: employeeInformation });
        } catch (e) {
          next(e);
        }
    });

    //get one account//
    //!!! This route currently does not work, to fix later (does not return any data, though it doesn't break)//
    router.get("/:id", validateSchema(MongoIdSchema), async (req: IMongoIdSchema, res, next) => {
      
      try {
          
          const employeeInformation = await Employee.aggregate([
            {
              '$match': {
                '_id': req.params.id,
              }
              
            }])
            console.log(employeeInformation);
            console.log(req.params.id);
            /*
           {
              '$lookup': {
                'from': 'workerlogs', 
                'localField': '_id', 
                'foreignField': 'employeeID', 
                'as': 'employeeData'
              }
            }])
           
            /*  {
              '$project': {
                'netID': '$netID', 
                'totalHours': {
                  '$sum': '$employeeData.timeWorked'
                }
              }
            }
          ])
*/
          res.send({ employeeData: employeeInformation });
      } catch (e) {
        next(e);
      }
    });

    // delete new account
    router.delete("/:id", validateSchema(schema.CreateEmployeeSchema), async (req, res, next) => {
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

// router.get("/", async (req, res, next) => {
//     res.status(501).send({message: "NOT_IMPLEMENTED"});
// });

// router.get("/:id", validateSchema(MongoIdSchema), async(req: IMongoIdSchema, res, next) => {
//     res.status(501).send({message: "NOT_IMPLEMENTED"});
// });