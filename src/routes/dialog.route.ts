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

    return res.json({message: "Диалог создан успешно!"});
  } catch(err) {
    return res.status(500).json({message: "Ошибка сервера"});
  }
});

module.exports = router;