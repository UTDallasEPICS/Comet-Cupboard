import express from "express"
import { getAllItems, getOnlyCategory } from "../services/item"

export default (router: express.Router) => {
	//"Does the request match any of these?"
	router.post("/item/get", getAllItems)
	router.post("/item/getCategory", getOnlyCategory)
}
