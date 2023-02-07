import { Express } from "express";
import authController from "../Controllers/authController";
import dialogController from "../Controllers/dialogController";
import messageController from "../Controllers/messageController";
import usersController from "../Controllers/usersController";

const createRoutes = (app: Express) => {
  app.post("/api/auth/reg", authController().reg);
  app.post("/api/auth/entrance", authController().entrance);
  app.post("/api/dialog/new-dialog", dialogController().newDialog);
  app.get("/api/dialog/my-dialogs", dialogController().myDialogs);
  app.post("/api/message/new-message", messageController().newMessage);
  app.get("/api/message/get-messages/:id", messageController().getMessages);
  app.get("/api/users/users-search", usersController().searchUsers);
  app.get("/api/users/all-users", usersController().getAllUsers);
  app.post("/api/users/comrade", usersController().findComrade);
};

export default createRoutes;
