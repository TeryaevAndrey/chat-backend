import { Request, Response } from "express";

const Router = require("express");
const expressWs = require("express-ws");
const MessageSchema = require("../models/Message");
import {expressWss} from "../index";
const checkAuth = require("../utils/checkAuth");

const router = Router();
expressWs(router);

router
  .ws("/new-message/:id", (ws, req: Request) => {
    const id = req.params.id;

    ws.on("connection", () => {
      console.log("Подключено");
    })

    ws.on("message", (msg) => {
      expressWss.getWss(`/new-message/${id}`).clients.forEach(client => {
          client.send(msg);
      });
    });
  })
  .post("/new-message",checkAuth, async (req: Request, res: Response) => {
    try {
      const { messageText, dialog }: {
        messageText: string;
        dialog: string;
      } = req.body;
      const senderId: string = req.userId;

      const message = await new MessageSchema({
        message: messageText,
        dialog,
        sender: senderId,
      });

      await message.save();

      return res.json({ message: "Сообщение отправлено" });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  router.get("/get-messages/:id", async(req: Request, res: Response) => {
    try {
      const dialogId = req.params.id;

      const messages = await MessageSchema.find({dialog: dialogId});

      return res.json({message: "Сообщения, которые мы нашли", messages});
    } catch(err) {
      return res.status(500).json({message: "Ошибка сервера", err: err.message});
    }
  });

module.exports = router;
