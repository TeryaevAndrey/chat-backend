import { Request, Response } from "express";
const checkAuth = require("../utils/checkAuth");

const Router = require("express");
const DialogSchema = require("../models/Dialog");
const UserSchema = require("../models/User");

const router = Router();

router.post("/new-dialog", checkAuth, async(req: Request, res: Response) => {
  try {
    const {comradeId, comradeName}: {comradeId: string; comradeName: string} = req.body;
    const lastMessage: string = req.lastMessage;
  
    const candidate = await DialogSchema.findOne({mainUserId: req.userId || comradeId, comradeId: comradeId || req.userId});

    if(candidate) {
      return res.status(500).json({message: "Такой диалог уже существует"});
    }

    const user = await UserSchema.findOne({_id: req.userId});
  
    const dialog = await new DialogSchema({
      mainUserId: req.userId,
      comradeId,
      mainUserName: user.name,
      comradeName: comradeName,
      lastMessage
    });

    await dialog.save();

    return res.json({message: "Диалог создан успешно!", dialogId: dialog._id});
  } catch(err) {
    return res.status(500).json({message: "Ошибка сервера", err: err.message});
  }
});

router.get("/my-dialogs", checkAuth, async(req: Request, res: Response) => {
  try {
    const dialogs = await DialogSchema.find({mainUserId: req.userId});

    return res.json({dialogs});
  } catch(err) {
    return res.status(500).json({message: "Ошибка сервера", err: err.message});
  }
});

module.exports = router;