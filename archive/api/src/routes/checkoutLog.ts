import express from "express";
import status from "http-status";
import { validate as validateSchema, MongoIdSchema, IMongoIdSchema, NetIdSchema } from "../schema";
import * as schema from "../schema/checkoutLog";
import { CheckoutLog } from "../models";
//const { differenceInDays } = require('date-fns');
const isSameWeek = require('date-fns/isSameWeek');

export const router = express.Router();

/*
checkoutlog keeps track the purchase histories; we can purchases made by a certain customer and all the purchases
checkoutlog: after a customer has made their purchase from cart, that purchase should be moved to moved to checkoutlog.
There are functions that can get stats about the purchases that has been made.
*/
router.post("/", validateSchema(schema.CreateCheckoutLogSchema), async (req: schema.ICreateCheckoutLogSchema, res, next) => {
    try {

     //--> get purchaseID (cart id) from the cart page
        const newcheckoutLog = new CheckoutLog({
            recipientID: req.body.recipientID,
            workerID: req.body.workerID,
            dateOfCheckout: req.body.dateOfCheckout,
            itemIDs: req.body.itemIDs
        });
        await newcheckoutLog.save();
        res.send({ message: "Succesfully created checkout log"});
    } catch(e) {
        next(e);
    }
});



//gets all purchases on record
router.get("/", async (req, res, next) => {
    try{
        const existingCheckoutLog = await CheckoutLog.find();
        res.send({ logs: existingCheckoutLog});
    } catch (e) {
        next(e);
    }
});

//this function gets the purchase logs in a certain time frame
router.get("/byTimeRange/:startDate/:endDate", async (req, res, next) => {
    try {

      const startDate = new Date(req.params.startDate);
      const endDate = new Date(req.params.endDate);
      
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
  
      const result = await CheckoutLog.aggregate([
        {
          $match: {
            dateOfCheckout: {
              $gte: startDateObj,
              $lte: endDateObj
            }
          }
        }
      ]);
  
      res.status(200).json({ filteredLogs: result });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to fetch checkout logs by time range." });
      next(error);
    }
  });

  //gets the total number of visits in a given time period
  router.get('/totalVisits/:startDate/:endDate', async (req, res, next) => {
    try {
      //parse start and end dates from request parameters
      const startDate = new Date(req.params.startDate);
      const endDate = new Date(req.params.endDate);
      
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
  
      const result = await CheckoutLog.aggregate([
        {
          $match: {
            dateOfCheckout: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalVisits: { $sum: 1 },
          },
        },
      ]);
  
      const totalVisits = result.length > 0 ? result[0].totalVisits : 0;
  
      res.status(200).json({ totalVisits });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch total visits.' });
    }
  });

  //gets the total number of unique customers in a given time period
  router.get('/uniqueCustomers/:startDate/:endDate', async (req, res, next) => {
    try {
     
      const startDate = new Date(req.params.startDate);
      const endDate = new Date(req.params.endDate);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const result = await CheckoutLog.aggregate([
        {
          $match: {
            dateOfCheckout: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: '$recipientID',
          },
        },
        {
          $group: {
            _id: null,
            uniqueCustomers: { $sum: 1 },
          },
        },
      ]);
  
      const uniqueCustomers = result.length > 0 ? result[0].uniqueCustomers : 0;
  
      res.status(200).json({ uniqueCustomers });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch unique customers.' });
    }
  });
  
  
//gets the most frequent customers
  router.get("/frequentCustomers", async (req, res, next) => {
    try {
      const result = await CheckoutLog.aggregate([
        {
          $group: {
            _id: "$recipientID",
            totalPurchases: { $sum: 1 }
          }
        },
        {
          $sort: { totalPurchases: -1 }
        },
        {
          $limit: 2 //adjust the limit as needed
        }
      ]);
  
      const topCustomerIDs = result.map(item => item._id);
  
      res.status(200).json({ topCustomerIDs });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to fetch top customers." });
    }
  });

  //gets the most frequent customers this semester
  router.get("/frequentCustomersThisSemester", async (req, res, next) => {
    try {
      const startDate = '2023-08-22'; //first day of the semester
      const endDate = new Date(); //current date
  
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
  
      const result = await CheckoutLog.aggregate([
        {
          $match: {
            dateOfCheckout: {
              $gte: startDateObj,
              $lte: endDateObj
            }
          }
        },
        {
          $group: {
            _id: "$recipientID",
            totalPurchases: { $sum: 1 }
          }
        },
        {
          $sort: { totalPurchases: -1 }
        },
        {
          $limit: 2 //adjust the limit as needed
        }
      ]);
  
      const topCustomerIDs = result.map(item => item._id);
  
      res.status(200).json({ topCustomerIDs });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to fetch top customers this semester." });
    }
  });

  //gets the total number of items checked out in a certain time frame
  router.get('/totalItems/:startDate/:endDate', async (req, res, next) => {
    try {
      const startDate = new Date(req.params.startDate);
      const endDate = new Date(req.params.endDate);
  
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
  
      const result = await CheckoutLog.aggregate([
        {
          $match: {
            dateOfCheckout: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $unwind: '$itemIDs', 
        },
        {
          $group: {
            _id: '$itemIDs',
            totalItems: { $sum: 1 }, 
          },
        },
        {
          $group: {
            _id: null,
            grandTotalItems: { $sum: '$totalItems' }, //sum up the total items
          },
        },
      ]);
  
      const grandTotalItems = result.length > 0 ? result[0].grandTotalItems : 0;
  
      res.status(200).json({ grandTotalItems });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch total items.' });
    }
  });

  //gets the average number of items purchased by a customer in a certain time frame
  router.get("/averageItems/:startDate/:endDate", async (req, res, next) => {
    try {
      const startDate = new Date(req.params.startDate);
      const endDate = new Date(req.params.endDate);
  
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
  
      const result = await CheckoutLog.aggregate([
        {
          $match: {
            dateOfCheckout: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: "$recipientID",
            totalItems: { $sum: { $size: "$itemIDs" } },
            totalVisits: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            averageItemsPerCustomer: { $avg: { $divide: ["$totalItems", "$totalVisits"] } },
          },
        },
      ]);
  
      const averageItemsPerCustomer = result[0] ? result[0].averageItemsPerCustomer : 0;
  
      res.status(200).json({ averageItemsPerCustomer });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to calculate average items per customer." });
    }
  });

  //gets a list of the most popular items
  router.get("/mostPopularItems/:startDate/:endDate", async (req, res, next) => {
    try {
      const startDate = new Date(req.params.startDate);
      const endDate = new Date(req.params.endDate);
  
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const result = await CheckoutLog.aggregate([
        {
          $match: {
            dateOfCheckout: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $unwind: "$itemIDs", //split the array into individual items
        },
        {
          $group: {
            _id: "$itemIDs",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 }, 
        },
        {
          $limit: 1, //adjust as needed
        },
      ]);
  
      const mostPopularItem = result[0] ? result[0]._id : null;
  
      res.status(200).json({ mostPopularItem });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to find the most popular item." });
    }
  });
  
  
  

//gets all the past purchases of a customer
router.get("/:netID", validateSchema(NetIdSchema), async (req: IMongoIdSchema, res, next) => {
    try {
        if(!req.params.netID){
            return next({ message: "ID is required", status: status.BAD_REQUEST });
        }
        const eCheckoutLog = await CheckoutLog.find({ recipientID: req.params.netID });
        if(!eCheckoutLog) {
            return next ({
                message: "Checkout Log does not exist",
                status: status.BAD_REQUEST
            });
        }
        res.send({ CheckoutLog: eCheckoutLog });
    } catch(e) {
        next(e);
    }
});

//gets the date of the latest purchase
router.get("/getDate/:netID", validateSchema(NetIdSchema), async (req: IMongoIdSchema, res, next) => {
    try {
        if (!req.params.netID) {
            return next({ message: "netID is required", status: status.BAD_REQUEST });
        }

        const latestLog = await CheckoutLog.findOne({ recipientID: req.params.netID })
            .sort({ dateOfCheckout: -1 })
            .limit(1);

        if (!latestLog) {
            return next({
                message: "Checkout Log does not exist",
                status: status.BAD_REQUEST
            });
        }

        res.send({ latestDateOfCheckout: latestLog.dateOfCheckout });
    } catch (e) {
        next(e);
    }
});


//search by netid and then choose which purchase to delete
router.delete("/:id", validateSchema(MongoIdSchema), async ( req: IMongoIdSchema, res, next) => {
    try {
        if(!req.params.id){
            return next({ message: "Id is required", status: status.BAD_REQUEST });
        }
        await CheckoutLog.deleteOne({ _id: req.params.id});

        res.send({ message: "Succesfully deleted account"});
    } catch(e) {
        next(e);
    }
});

router.put("/:id", validateSchema(schema.CreateCheckoutLogSchema), async(req: schema.ICreateCheckoutLogSchema, res, next) => {
    try{

        const eCheckoutLog = await CheckoutLog.findOne({ _id: req.params.id});
        if(!eCheckoutLog){
            return next({
                message: "Form does not exist",
                status: status.BAD_REQUEST
            });
        }
        await CheckoutLog.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                recipientID: req.body.recipientID,
                workerID: req.body.workerID,
                dateOfCheckout: req.body.dateOfCheckout,
                itemIDs: req.body.itemIDs
            },
            {
                new: true
            }
        );
    res.send({ message: "CheckoutLog Updated"})
    } catch(e){
        next(e);
    }
});

//checks if the customer is ok to purchase based on their latest purchase date
router.get("/isDateOk/:netID", validateSchema(NetIdSchema), async (req: IMongoIdSchema, res, next) => {
    try {
        if (!req.params.netID) {
            return next({ message: "netID is required", status: status.BAD_REQUEST });
        }

        const latestLog = await CheckoutLog.findOne({ recipientID: req.params.netID })
            .sort({ dateOfCheckout: -1 })
            .limit(1);

        if (!latestLog) {
            return next({
                message: "Checkout Log does not exist",
                status: status.BAD_REQUEST
            });
        }

        const latestDate = new Date(latestLog.dateOfCheckout);

        //check if the latest purchase and today are in the same week
        const isInSameWeek = isSameWeek(new Date(), latestDate);

        //return false if they are in the same week; otherwise, return true
        const canMakePurchase = !isInSameWeek;
        res.send({canMakePurchase });
    } catch (e) {
        next(e);
    }
});