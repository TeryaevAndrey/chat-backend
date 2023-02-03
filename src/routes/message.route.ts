import { Request, Response } from "express";

const Router = require("express");
const expressWs = require("express-ws");
const MessageSchema = require("../models/Message");

const router = Router();
expressWs(router);

router
  .ws("/new-message", (ws, req: Request) => {
    ws.on("connection", () => {
      console.log("Подключено");
    })

    ws.on("message", (msg) => {
      console.log(msg);
      ws.send(msg);
    });
  })
  .post("/new-message", async (req: Request, res: Response) => {
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
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  });

module.exports = router;
