import bcrypt from "bcrypt";
import { Request, Response } from "express";
import socket from "socket.io";
import jwt from "jsonwebtoken";
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

      if (!password) {
        return res.status(500).json({ message: "Введите пароль" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserModel({
        avatar: "/img/avatar.png",
        userName: userName,
        password: hashedPassword,
        isOnline: true,
        wasOnline: "",
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      return res.status(201).json({
        message: "Пользователь создан успешно",
        userInfo: {
          userId: user._id,
          token,
          userName,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера", err });
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

      const token = jwt.sign(
        { userId: user._id },
        process.env.SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      await user.updateOne({ $set: { isOnline: true } });

      return res.json({
        message: "Вход выполнен успешно",
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

  makeOnline = async (req: Request, res: Response) => {
    try {
      const {
        userId,
      }: {
        userId: string;
      } = req.body;

      await UserModel.findOneAndUpdate({ _id: userId }, { isOnline: true });

      return res.json({ message: "Пользователь в сети!" });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  makeOffline = async (req: Request, res: Response) => {
    try {
      const { userId }: { userId: string } = req.body;

      await UserModel.findOneAndUpdate({ _id: userId }, { isOnline: false });

      return res.json({ message: "Пользователь вышел из сети" });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  exit = async (req: Request, res: Response) => {
    try {
      await UserModel.findOneAndUpdate(
        { _id: req.userId },
        { isOnline: false }
      );

      return res.json({ message: "Вы вышли из аккаунта" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Ошибка сервера. Попробуйте ещё раз" });
    }
  };
}

export default AuthController;
