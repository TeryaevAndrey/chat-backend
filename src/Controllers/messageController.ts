import { Request, Response } from "express";
import MessageSchema from "../models/MessageModel";

const messageController = () => {
  const newMessage = async (req: Request, res: Response) => {
    try {
      const {
        messageText,
        dialog,
      }: {
        messageText: string;
        dialog: string;
      } = req.body;
      const senderId: string = req.userId;

      const message = new MessageSchema({
        message: messageText,
        dialog,
        sender: senderId,
      });

      await message.save();

      return res.json({ message: "Сообщение отправлено" });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  const getMessages = async (req: Request, res: Response) => {
    try {
      const dialogId = req.params.id;

      const messages = await MessageSchema.find({ dialog: dialogId });

      return res.json({ message: "Сообщения, которые мы нашли", messages });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  return { newMessage, getMessages };
};

export default messageController;
