import { Request, Response } from "express";
import socket from "socket.io";
import UsersModel from "../models/UserModel";

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
}

export default UsersController;
