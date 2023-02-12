import { Request, Response } from "express";
import socket from "socket.io";
import { dataUri } from "../middlewares/multer";
import UsersModel from "../models/UserModel";
import bcrypt from "bcrypt";

import { uploader } from "../config/cloudinaryConfig";

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

  updateUserData = async (req: Request, res: Response) => {
    try {
      const { newUserName, oldPassword, newPassword } = req.body;

      if(req.file && newUserName && oldPassword && newPassword) {
        const user = await UsersModel.findOne({_id: req.userId});

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
          return res.status(400).json({ message: "Неверный старый пароль" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const users = await UsersModel.find({userName: newUserName});

        if(users) {
          return res.status(500).json({message: "Такое имя уже зарегистрировано"})
        }

        const file = dataUri(req).content;

        return uploader
          .upload(file)
          .then(async (result: any) => {
            const image = result.url;

            await UsersModel.updateOne(
              { _id: req.userId },
              {
                avatar: image,
                userName: newUserName, 
                password: hashedPassword
              }
            );

            return res.status(200).json({
              message: "Ваше изображение успешно загружено в облачный сервис",
              data: {
                image,
              },
            });
          })
      }

      if (req.file && !newUserName && !oldPassword && !newPassword) {
        const file = dataUri(req).content;

        return uploader
          .upload(file)
          .then(async (result: any) => {
            const image = result.url;

            await UsersModel.updateOne(
              { _id: req.userId },
              {
                avatar: image,
              }
            );

            return res.status(200).json({
              message: "Ваше изображение успешно загружено в облачный сервис",
              data: {
                image,
              },
            });
          })
          .catch((err: any) =>
            res.status(400).json({
              message: "Что-то пошло не так при обработке Вашего запроса",
            })
          );
      }
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };
}

export default UsersController;
