import express from "express";
import { default as disableBrowserCache } from "nocache";
import { router as userRoute } from "./user";
import { router as itemRoute } from "./items";
import { router as EmployeeRoute } from "./employee";
import { router as workerLogRoute } from "./workerLogs";

export const router = express.Router();

declare module "express-session" {
  export interface SessionData {
    _id: string;
    loggedIn: boolean;
    userId: string;
    name: string;
  }
}

// disable browser cache for all requests
router.use(disableBrowserCache());

// human-readable API index
router.get("/", (req: express.Request, res: express.Response) => {
  res.send("Comet Cupboard API");
});

// API endpoints
router.use("/user", userRoute);

router.use("/item", itemRoute);

router.use("/employee", EmployeeRoute);

router.use("/workerLogs", workerLogRoute);

router.use((req: express.Request, res: express.Response) => {
  res.status(404).send({ message: "Endpoint not found" });
});