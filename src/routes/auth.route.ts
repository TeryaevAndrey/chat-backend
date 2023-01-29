import { Request, Response } from "express";
const config = require("config");
const UserSchema = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Router = require("express");

const router = Router();

router.post("/reg", async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;

    const candidate = await UserSchema.findOne({ name });

    if (candidate) {
      return res
        .status(500)
        .json({ message: "Пользователь с таким именем существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await new UserSchema({
      name,
      password: hashedPassword,
      isOnline: true,
    });

    await user.save();

    req.userId = await user._id;

    return res.status(201).json({ message: "Пользователь успешно создан" });
  } catch (err) {
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/entrance", async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;

    const user = await UserSchema.findOne({ name });

    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    const secretKey = config.get("secreyKey");

    const token = await jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "1d",
    });

    await user.updateOne({ $set: { isOnline: true } });

    req.userId = await user._id;

    return res.json({
      message: "Успешно",
      token,
      userId: user.id,
      name: user.name,
    });
  } catch (err) {
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
