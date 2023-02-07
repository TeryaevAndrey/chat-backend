import { Request, Response } from "express";
import UserSchema from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";

const authController = () => {
  const reg = async (req: Request, res: Response) => {
    try {
      const { name, password } = req.body;

      const candidate = await UserSchema.findOne({ name });

      if (candidate) {
        return res
          .status(500)
          .json({ message: "Пользователь с таким именем существует" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserSchema({
        name,
        password: hashedPassword,
        isOnline: true,
      });

      const token = jwt.sign({ userId: user.id }, config.get("secretKey"), {
        expiresIn: "1d",
      });

      await user.save();

      return res.status(201).json({
        message: "Пользователь успешно создан",
        userInfo: {
          userId: user._id,
          token,
          name,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  const entrance = async (req: Request, res: Response) => {
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

      const token = jwt.sign({ userId: user.id }, config.get("secretKey"), {
        expiresIn: "1d",
      });

      await user.updateOne({ $set: { isOnline: true } });

      return res.json({
        message: "Успешно",
        token,
        userId: user.id,
        name: user.name,
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  return { reg, entrance };
};

export default authController;
