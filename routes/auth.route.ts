import { Request, Response } from "express";
const UserSchema = require("../models/User");
const bcrypt = require("bcrpyt");

const Router = require("express");

const router = Router();

router.post(
  "/reg", 
  async(req: Request, res: Response) => {
    try {
      const {name, password} = req.body;

      const candidate = UserSchema.findOne({name});

      if(candidate) {
        return res.status(500).json({message: "Пользователь с таким именем существует"});
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserSchema({name, password: hashedPassword});

      await user.save();

      return res.status(201).json({message: "Пользователь успешно создан"});
    } catch(err) {
      return res.status(500).json({message: "Ошибка сервера"})
    }
  }
)

module.exports = router;