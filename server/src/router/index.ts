import express from "express"
import item from "./item"

const router = express.Router();

export default (): express.Router => {
    //Order of routing
    item(router); 
    return router; 
}