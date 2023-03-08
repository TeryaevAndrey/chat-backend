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

io.on("connection", (socket) => {
  console.log(socket.id + " Подключился");

  socket.on("ROOM:JOIN", (dialogId) => {
    socket.join(dialogId);
    console.log("Пользователь подключился к " + dialogId);
  });

  socket.on("ROOM:NEW-MESSAGE", (message) => {
    socket.to(message.dialog).emit("ROOM:NEW-MESSAGE", message);
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " Отключился");
  });
});

createRoutes(app, io);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);

    http.listen(process.env.PORT, () => {
      console.log("server started");
    });
  } catch (err) {
    console.log("Server Error", err);
    process.exit(1);
  }
};

startServer();
