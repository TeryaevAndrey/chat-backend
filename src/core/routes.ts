import { Express } from "express";
import AuthCtrl from "../controllers/AuthController";
import UsersCtrl from "../controllers/UsersController";
import DialogsCtrl from "../controllers/DialogsController";
import MessagesCtrl from "../controllers/MessagesController";
import checkAuth from "../utils/checkAuth";

const createRoutes = (app: Express) => {
  const AuthController = new AuthCtrl();
  const UsersController = new UsersCtrl();
  const DialogsController = new DialogsCtrl();
  const MessagesController = new MessagesCtrl();

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
