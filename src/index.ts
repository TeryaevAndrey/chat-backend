import express from "express";
import config from "config";
import mongoose from "mongoose";
import createRoutes from "./core/routes";
import createSocket from "./core/socket";
import { createServer } from "http";

const app = express();

const mongoUrl: string = config.get("mongoUrl");

const http = createServer(app);
const io = createSocket(http);

createRoutes(app, io);

const startServer = async () => {
  try {
    await mongoose.connect(mongoUrl);

    app.listen(config.get("port"), () => {
      console.log("server started");
    });
  } catch (err) {
    console.log("Server Error", err);
    process.exit(1);
  }
};

startServer();
