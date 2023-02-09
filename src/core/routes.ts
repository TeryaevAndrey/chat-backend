import { Express } from "express";
import AuthCtrl from "../controllers/AuthController";
import UsersCtrl from "../controllers/UsersController";

const createRoutes = (app: Express) => {
  const AuthController = new AuthCtrl();
  const UsersController = new UsersCtrl();

  app.post("/api/auth/reg", AuthController.reg);
  app.post("/api/auth/entrance", AuthController.entrance);
  app.post("/api/users/users-search", UsersController.usersSearch);
  app.get("/api/users/get-all-users", UsersController.getAllUsers);
  // app.post("/api/dialog/new-dialog", dialogController().newDialog);
  // app.get("/api/dialog/my-dialogs", dialogController().myDialogs);
  // app.post("/api/message/new-message", messageController().newMessage);
  // app.get("/api/message/get-messages/:id", messageController().getMessages);
  // app.get("/api/users/users-search", usersController().searchUsers);
  // app.get("/api/users/all-users", usersController().getAllUsers);
};

export default createRoutes;
