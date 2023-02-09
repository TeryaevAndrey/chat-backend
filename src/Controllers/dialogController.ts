import { Request, Response } from "express";
import DialogSchema from "../models/DialogModel";
import UserSchema from "../models/UserModel";

const dialogController = () => {
  const newDialog = async (req: Request, res: Response) => {
    try {
      const {
        comradeId,
        comradeName,
      }: { comradeId: string; comradeName: string } = req.body;
      const lastMessage: string | undefined = req.lastMessage;

      const candidate = await DialogSchema.findOne({
        $or: [{ comradeId: req.userId }, { comradeId: comradeId }],
      });

      //{mainUserId: req.userId || comradeId, comradeId: req.userId || comradeId}

      if (candidate) {
        return res.json({
          message: "Такой диалог уже существует",
          dialogId: candidate._id,
        });
      }

      const user = await UserSchema.findOne({ _id: req.userId });

      if (user) {
        const dialog = await new DialogSchema({
          mainUserId: req.userId,
          comradeId,
          mainUserName: user.name,
          comradeName: comradeName,
          lastMessage,
        });

        await dialog.save();

        return res.json({
          message: "Диалог создан успешно!",
          dialogId: dialog._id,
        });
      }
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  const myDialogs = async (req: Request, res: Response) => {
    try {
      const dialogs = await DialogSchema.find({
        $or: [{ mainUserId: req.userId }, { comradeId: req.userId }],
      });

      return res.json({ dialogs });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  return { newDialog, myDialogs };
};

export default dialogController;
