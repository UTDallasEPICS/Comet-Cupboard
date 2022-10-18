import express from "express";
import { default as disableBrowserCache } from "nocache";
import { router as userRoute } from "./user";
import { router as itemRoute } from "./items";
import { router as NFTBRoute } from "./NFTB";
import { router as EmployeeRoute } from "./employee";


export const router = express.Router();

// disable browser cache for all requests
router.use(disableBrowserCache());

// human-readable API index
router.get("/", (req: express.Request, res: express.Response) => {
  res.send("Example API");
});

// API endpoints
router.use("/user", userRoute);

router.use("/item", itemRoute);

router.use("/NFTB", NFTBRoute);

router.use("/employee", EmployeeRoute);

router.use((req: express.Request, res: express.Response) => {
  res.status(404).send({ message: "Endpoint not found" });
});