import { Request, Response } from "express";
import socket from "socket.io";
import MessageModel from "../models/MessageModel";

interface IMessage {
  message: string;
  dialog: string;
  files?: [];
  sender: string;
}

class MessagesController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }

  newMessage = async (req: Request, res: Response) => {
    try {
      const { message, dialog, files, sender }: IMessage = req.body;

      const newMessage = new MessageModel({
        message,
        dialog,
        files,
        sender,
      });

      await newMessage.save();

      return res.json({ message: "Сообщение отправлено", newMessage });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера", err });
    }
  };

  getMessages = async (req: Request, res: Response) => {
    try {
      const dialogId = req.params.dialogId;

      const messages = await MessageModel.find({ dialog: dialogId });

      return res.json({ message: "Сообщение, которые мы нашли", messages });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };
}

export default MessagesController;
