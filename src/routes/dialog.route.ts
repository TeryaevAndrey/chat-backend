import { Request, Response } from "express";
const checkAuth = require("../utils/checkAuth");

const Router = require("express");
const DialogSchema = require("../models/Dialog");
const UserSchema = require("../models/User");

const router = Router();

router.post("/new-dialog", checkAuth, async (req: Request, res: Response) => {
  try {
    const {
      comradeId,
      comradeName,
    }: { comradeId: string; comradeName: string } = req.body;
    const lastMessage: string = req.lastMessage;

    const candidate = await DialogSchema.findOne({
      $or: [{ comradeId: req.userId }, { comradeId: comradeId }],
    });

    console.log(candidate);
    //{mainUserId: req.userId || comradeId, comradeId: req.userId || comradeId}

    if (candidate) {
      return res.json({
        message: "Такой диалог уже существует",
        dialogId: candidate._id,
      });
    }

    const user = await UserSchema.findOne({ _id: req.userId });

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
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Ошибка сервера", err: err.message });
  }
});

router.get("/my-dialogs", checkAuth, async (req: Request, res: Response) => {
  try {
    const dialogs = await DialogSchema.find({
      $or: [{ mainUserId: req.userId }, { comradeId: req.userId }],
    });

    return res.json({ dialogs });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Ошибка сервера", err: err.message });
  }
});

module.exports = router;
