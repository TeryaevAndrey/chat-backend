import { Request, Response } from "express";
import socket from "socket.io";
import DialogModel from "../models/DialogModel";

interface IDialog {
  creator: string;
  fellow: string;
  creatorAvatar: string;
  fellowAvatar: string;
  creatorName: string;
  fellowName: string;
  lastMessage: string;
}

class DialogController {
  io?: socket.Server;

  constructor(io?: socket.Server) {
    this.io = io;
  }

  newDialog = async (req: Request, res: Response) => {
    try {
      const { creator, fellow, creatorAvatar, fellowAvatar, creatorName, fellowName, lastMessage }: IDialog =
        req.body;

      const candidate = await DialogModel.findOne({
        $or: [{ creator }, { creator: fellow }],
      });

      if (candidate) {
        return res.json({
          message: "Диалог уже существует",
          dialogId: candidate._id,
        });
      }

      const dialog = new DialogModel({
        creator,
        fellow,
        creatorAvatar,
        fellowAvatar,
        creatorName,
        fellowName,
        lastMessage,
      });

      await dialog.save();

      return res.json({
        message: "Диалог создан успешно!",
        dialogId: dialog._id,
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  getMyDialogs = async (req: Request, res: Response) => {
    try {
      const dialogs = await DialogModel.find({
        $or: [{ creator: req.userId }, { fellow: req.userId }],
      });

      if(dialogs.length === 0) {
        return res.status(404).json({message: "У Вас нет переписок"});
      }

      return res.json({ message: "Мы нашли ваши диалоги", dialogs });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };
}

export default DialogController;
