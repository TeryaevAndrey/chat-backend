import { Request, Response } from "express";
import socket from "socket.io";
import DialogModel from "../models/DialogModel";

interface IDialog {
  creator: string;
  fellow: string;
  lastMessage: string | undefined;
}

class DialogController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }

  newDialog = async (req: Request, res: Response) => {
    try {
      const { creator, fellow, lastMessage }: IDialog = req.body;

      const candidate = await DialogModel.findOne({
        $or: [
          { creator, fellow },
          { creator: fellow, fellow: creator },
        ],
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
        lastMessage,
      });

      await dialog.save();

      return res.json({
        message: "Диалог создан успешно!",
        dialogId: dialog._id,
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера", err });
    }
  };

  getMyDialogs = async (req: Request, res: Response) => {
    try {
      const dialogs = await DialogModel.find({
        $or: [{ creator: req.userId }, { fellow: req.userId }],
      }).populate(["creator", "fellow"]);

      if (dialogs.length === 0) {
        return res.status(404).json({ message: "У Вас нет переписок" });
      }

      return res.json({ message: "Мы нашли ваши диалоги", dialogs });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  getDialogInfo = async (req: Request, res: Response) => {
    try {
      const {
        dialogId,
      }: {
        dialogId: string;
      } = req.body;

      const dialog = await DialogModel.findOne({ _id: dialogId });

      if (!dialog) {
        return res.status(400).json({ message: "Нам не удалось найти диалог" });
      }

      return res.json({ message: "Мы нашли этот диалог", dialog });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };
}

export default DialogController;
