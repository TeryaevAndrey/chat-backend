import express from "express";
import config from "config";
import mongoose from "mongoose";
import cors from "cors";
import createRoutes from "./core/routes";

const app = express();

const mongoUrl: string = config.get("mongoUrl");

app.use(express.json());
app.use(
  cors({
    origin: config.get("ALLOWED_ORIGIN"),
  })
);

createRoutes(app);

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
