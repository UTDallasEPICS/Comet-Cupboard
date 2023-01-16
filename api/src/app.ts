process.env.FORCE_COLOR = "true";
import dotenv from "dotenv";
import compression from "compression";
import cors from "cors";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { httpErrorHandler, validationErrorHandler, internalErrorHandler } from "./helpers/errors";
import { db } from "./helpers/db";

import { router as indexRoute } from "./routes";

console.log("===========================================");
console.log("API Starting");

// load .env
if (fs.existsSync(".env")) {
  console.log("Loading environment variables from .env");
  dotenv.config();
}
const SERVER_PORT = parseInt(process.env.SERVER_PORT || "3000", 10);
const CORS_ORIGIN_LIST = (process.env.CORS_ORIGINS || "http://localhost:8080,http://localhost:8000").split(",");

console.log("CORS Origins", CORS_ORIGIN_LIST);

// start web server
export const app = express();
app.listen(SERVER_PORT, () => {
  console.log(`[server] Server ready on port ${SERVER_PORT}`);
});

// middleware
app.use(
  cors({
    origin: CORS_ORIGIN_LIST,
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.use(compression());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({ client: db.getClient(), stringify: false }),
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000 //12 hours
    }
  })
);

// morgan
app.use(morgan("dev"));

// routes
app.use("/api/v1", indexRoute);

// error handlers
app.use(httpErrorHandler);
app.use(validationErrorHandler);
app.use(internalErrorHandler);