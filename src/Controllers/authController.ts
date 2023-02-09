import bcrypt from "bcrypt";
import { Request, Response } from "express";
import socket from "socket.io";
import jwt from "jsonwebtoken";
import config from "config";
import UserModel from "../models/UserModel";

interface IData {
  userName: string;
  password: string;
}

class AuthController {
  io?: socket.Server;

  constructor(io?: socket.Server) {
    this.io = io;
  }

  reg = async (req: Request, res: Response) => {
    try {
      const { userName, password }: IData = req.body;

      const candidate = await UserModel.findOne({ userName });

      if (candidate) {
        return res
          .status(500)
          .json({ message: "Пользователь с таким именем существует" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserModel({
        avatar: "",
        userName: userName,
        password: hashedPassword,
        isOnline: true,
        wasOnline: "",
      });

      const token = jwt.sign({ userId: user._id }, config.get("secretKey"), {
        expiresIn: "1d",
      });

      await user.save();

      return res.status(201).json({
        message: "Пользователь создан успешно",
        userInfo: {
          userId: user._id,
          token,
          userName,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  entrance = async (req: Request, res: Response) => {
    try {
      const { userName, password }: IData = req.body;

      const user = await UserModel.findOne({ userName });

      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Неверный пароль" });
      }

      const token = jwt.sign({ userId: user._id }, config.get("secretKey"), {
        expiresIn: "1d",
      });

      await user.updateOne({ $set: { isOnline: true } });

      return res.json({
        message: "Вход выполнен успешно",
        userId: user._id,
        token,
        userName: userName,
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };
}

export default AuthController;
