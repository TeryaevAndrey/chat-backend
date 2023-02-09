import { Express } from "express";
import AuthCtrl from "../controllers/AuthController";
import UsersCtrl from "../controllers/UsersController";
import DialogCtrl from "../controllers/dialogController";

const createRoutes = (app: Express) => {
  const AuthController = new AuthCtrl();
  const UsersController = new UsersCtrl();
  const DialogController = new DialogCtrl();

  app.post("/api/auth/reg", AuthController.reg);
  app.post("/api/auth/entrance", AuthController.entrance);
  app.post("/api/users/users-search", UsersController.usersSearch);
  app.get("/api/users/get-all-users", UsersController.getAllUsers);
  app.post("/api/dialogs/new-dialog", DialogController.newDialog);
  app.get("/api/dialogs/get-my-dialogs", DialogController.getMyDialogs);
  // app.post("/api/message/new-message", messageController().newMessage);
  // app.get("/api/message/get-messages/:id", messageController().getMessages);
};

export default createRoutes;
