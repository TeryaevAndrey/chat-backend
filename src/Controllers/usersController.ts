import { Request, Response } from "express";
import User from "../models/User";

const usersController = () => {
  const searchUsers = async (req: Request, res: Response) => {
    try {
      const searchStr: string = String(req.query.q);

      const user = await User.findOne({ name: searchStr });

      const total = await User.countDocuments();

      return res.json({
        message: "Пользователи, которых мы нашли",
        user,
        total,
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  const getAllUsers = async (req: Request, res: Response) => {
    try {
      const limit: number = Number(req.query.limit);

      const total = await User.countDocuments();

      if (limit) {
        const users = await User.find().limit(limit);
        return res.json({
          message: "Пользователи, которых мы нашли",
          users,
          total,
        });
      } else {
        const users = await User.find();
        return res.json({
          message: "Пользователи, которых мы нашли",
          users,
          total,
        });
      }
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  const findComrade = async (req: Request, res: Response) => {
    try {
      const { comradeId } = req.body;

      const comrade = await User.findOne({ _id: comradeId });

      res.json({ comrade });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  return { searchUsers, getAllUsers, findComrade };
};

export default usersController;
