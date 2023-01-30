import { Request, Response } from "express";

const Router = require("express");
const DialogSchema = require("../models/Dialog");

const router = Router();

router.post("/new-dialog", async(req: Request, res: Response) => {
  try {
    const {comrades}: {comrades: string} = req.body;
    const userId: string = req.userId;
    const lastMessage: string = req.lastMessage;
  
    const dialog = await new DialogSchema({
      participants: [userId, comrades],
      lastMessage
    });
  
    await dialog.save();


    return res.json({message: "Диалог создан успешно!"});
  } catch(err) {
    return res.status(500).json({message: "Ошибка сервера"});
  }
});

module.exports = router;