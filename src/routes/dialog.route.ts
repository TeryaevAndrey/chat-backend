import { Request, Response } from "express";
const checkAuth = require("../utils/checkAuth");

const Router = require("express");
const DialogSchema = require("../models/Dialog");

const router = Router();

router.post("/new-dialog", checkAuth, async(req: Request, res: Response) => {
  try {
    const {comradeId}: {comradeId: string} = req.body;
    const lastMessage: string = req.lastMessage;
  
    const dialog = await new DialogSchema({
      mainUserId: req.userId,
      comradeId,
      lastMessage
    });

    const dialogCandidate = await DialogSchema.findOne({_id: dialog._id});

    if(dialogCandidate) {
      return res.json({message: "Такой диалог уже существует"});
    }
  
    await dialog.save();

    return res.json({message: "Диалог создан успешно!", dialogId: dialog._id});
  } catch(err) {
    return res.status(500).json({message: "Ошибка сервера"});
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