import express from "express"
import dotenv from "dotenv"
import { router as indexRoute } from "./api" // implementing this

// Environment variables
dotenv.config({ path: "./.env" })

const PORT: number = parseInt(`${process.env.PORT}`)
const app = express()

app.use("/", indexRoute)
app.use(express.json())

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
