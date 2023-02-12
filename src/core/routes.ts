import express, { Express } from "express";
import cors from "cors";
import socket from "socket.io";
import AuthCtrl from "../controllers/AuthController";
import UsersCtrl from "../controllers/UsersController";
import DialogsCtrl from "../controllers/DialogsController";
import MessagesCtrl from "../controllers/MessagesController";
import checkAuth from "../utils/checkAuth";

const createRoutes = (app: Express, io: socket.Server) => {
  const AuthController = new AuthCtrl(io);
  const UsersController = new UsersCtrl(io);
  const DialogsController = new DialogsCtrl(io);
  const MessagesController = new MessagesCtrl(io);

  app.use(express.json());
  app.use(cors());

  app.post("/api/auth/reg", AuthController.reg);
  app.post("/api/auth/entrance", AuthController.entrance);
  app.post("/api/users/users-search", UsersController.usersSearch);
  app.get("/api/users/get-all-users", UsersController.getAllUsers);
  app.post("/api/dialogs/new-dialog", checkAuth, DialogsController.newDialog);
  app.get(
    "/api/dialogs/get-my-dialogs",
    checkAuth,
    DialogsController.getMyDialogs
  );
  app.post(
    "/api/messages/new-message",
    checkAuth,
    MessagesController.newMessage
  );
  app.get(
    "/api/messages/get-messages/:dialogId",
    checkAuth,
    MessagesController.getMessages
  );
};

export default createRoutes;
