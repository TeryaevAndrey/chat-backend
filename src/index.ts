import express from "express";
import dotenv from "dotenv";

dotenv.config();
import mongoose from "mongoose";
import createRoutes from "./core/routes";
import createSocket from "./core/socket";
import { createServer } from "http";

const app = express();

const http = createServer(app);
const io = createSocket(http);

createRoutes(app, io);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);

    app.listen(process.env.PORT, () => {
      console.log("server started");
    });
  } catch (err) {
    console.log("Server Error", err);
    process.exit(1);
  }
};

startServer();
