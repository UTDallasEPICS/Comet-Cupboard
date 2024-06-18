import express from "express"

import { router as userRoute } from "./user"
import { router as itemRoute } from "./items"
import { router as EmployeeRoute } from "./employee"
import { router as workerLogRoute } from "./workerLogs"
import { router as donorRoute } from "./donor"
import { router as checkoutLogRoute } from "./checkoutLog"
import { router as cartRoute } from "./cart"

export const router = express.Router()

// human-readable API index
router.get("/", (request, response) => {
	response.send("Comet Cupboard API")
})

// API endpoints
router.use("/user", userRoute)
router.use("/item", itemRoute)
router.use("/employee", EmployeeRoute)
router.use("/workerLogs", workerLogRoute)
router.use("/donor", donorRoute)
router.use("/checkoutLog", checkoutLogRoute)
router.use("/cart", cartRoute)

router.use((request, response) => {
	response.status(404).send({ message: "Endpoint not found" })
})

export default router
