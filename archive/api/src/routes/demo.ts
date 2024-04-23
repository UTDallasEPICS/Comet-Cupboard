import express from "express";
export const router = express.Router();


router.get("/", (req, res) => 
{
    res.send("Demo Print as webpage");
    //res.json({Messege: "Demo Print as a json print"});
});

