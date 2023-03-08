import express, { Express, urlencoded } from "express";
import cors from "cors";
import socket from "socket.io";
import AuthCtrl from "../Controllers/AuthController";
import UsersCtrl from "../Controllers/UsersController";
import DialogsCtrl from "../Controllers/DialogsController";
import MessagesCtrl from "../Controllers/MessagesController";
import checkAuth from "../utils/checkAuth";
import { multerUploads } from "../utils/multer";

const createRoutes = (app: Express, io: socket.Server) => {
  const AuthController = new AuthCtrl(io);
  const UsersController = new UsersCtrl(io);
  const DialogsController = new DialogsCtrl(io);
  const MessagesController = new MessagesCtrl(io);

  app.use(urlencoded({ extended: false }));
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
  app.post(
    "/api/users/update-data",
    multerUploads.single("avatar"),
    UsersController.updateDataUser
  );
  app.get("/api/users/get-my-data", checkAuth, UsersController.getMyData);
  app.get("/api/auth/exit", checkAuth, AuthController.exit);
  app.post(
    "/api/dialogs/get-dialog-info",
    checkAuth,
    DialogsController.getDialogInfo
  );
  app.post("/api/users/get-user", checkAuth, UsersController.getUser);
};

export default createRoutes;
