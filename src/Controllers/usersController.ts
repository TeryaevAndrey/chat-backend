import { Request, Response } from "express";
import socket from "socket.io";
import UsersModel from "../models/UserModel";
import { cloudinary } from "../utils/cloudinary";
import bcrypt from "bcrypt";

class UsersController {
  io?: socket.Server;

  constructor(io?: socket.Server) {
    this.io = io;
  }

  usersSearch = async (req: Request, res: Response) => {
    try {
      const { userName }: { userName: string } = req.body;

      const users = await UsersModel.find({
        userName: { $regex: userName, $options: "i" },
      });

      if (!users) {
        return res.status(404).json({
          message: "Нам не удалось найти пользователей с данным именем",
        });
      }

      return res.json({ message: "Вот кого нам удалось найти", users });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const limit: number = Number(req.query.limit);
      const page: number = Number(req.query.page);

      const users = await UsersModel.find()
        .limit(limit)
        .skip(limit * page);

      const total = await UsersModel.countDocuments();

      return res.json({ message: "Все пользователи", users, total });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  updateDataUser = async (req: Request, res: Response) => {
    try {
      const {
        newUserName,
        oldPassword,
        newPassword,
      }: {
        newUserName?: string;
        oldPassword?: string;
        newPassword?: string;
      } = req.body;

      if (req.file) {
        const resultFile = await cloudinary.v2.uploader.upload(req.file.path);

        const candidate = await UsersModel.findOne({ userName: newUserName });

        if (candidate.userName === newUserName) {
          return res
            .status(500)
            .json({ message: "Пользователь с таким именем уже существует" });
        }

        const currentUser = await UsersModel.findOne({ _id: req.userId });

        if (oldPassword && newPassword) {
          const isMatch = await bcrypt.compare(
            oldPassword,
            currentUser.password
          );

          if (!isMatch) {
            return res
              .status(500)
              .json({ message: "Старый пароль не совпадает с существующим" });
          }

          const hashedPassword = bcrypt.hash(newPassword, 12);

          await UsersModel.updateOne(
            { _id: req.userId },
            {
              avatar: resultFile.secure_url,
              userName: newUserName || currentUser.userName,
              password: hashedPassword || currentUser.password,
            }
          );

          return res.status(200).json({
            message: "Данные обновлены",
            userInfo: {
              avatar: resultFile.secure_url,
              userName: newUserName,
            },
          });
        }
      } else {
        const candidate = await UsersModel.findOne({ userName: newUserName });

        if (candidate.userName === newUserName) {
          return res
            .status(500)
            .json({ message: "Пользователь с таким именем уже существует" });
        }

        const currentUser = await UsersModel.findOne({ _id: req.userId });

        if (oldPassword && newPassword) {
          const isMatch = await bcrypt.compare(
            oldPassword,
            currentUser.password
          );

          if (!isMatch) {
            return res
              .status(500)
              .json({ message: "Старый пароль не совпадает с существующим" });
          }

          const hashedPassword = bcrypt.hash(newPassword, 12);

          await UsersModel.updateOne(
            { _id: req.userId },
            {
              userName: newUserName || currentUser.userName,
              password: hashedPassword || currentUser.password,
            }
          );

          return res.status(200).json({
            message: "Данные обновлены",
            userInfo: {
              userName: newUserName,
            },
          });
        }
      }
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };
}

export default UsersController;
