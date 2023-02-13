import { Request, Response } from "express";
import socket from "socket.io";
import UserModel from "../models/UserModel";
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

      const users = await UserModel.find({
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

      const users = await UserModel.find()
        .limit(limit)
        .skip(limit * page);

      const total = await UserModel.countDocuments();

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
        userId,
      }: {
        newUserName?: string;
        oldPassword?: string;
        newPassword?: string;
        userId: string;
      } = req.body;

      const file = req.file;

      if (file) {
        const resultFile = await cloudinary.v2.uploader.upload(file.path, {
          folder: "avatars",
        });

        const candidate = await UserModel.findOne({ userName: newUserName });

        if (candidate) {
          return res
            .status(500)
            .json({ message: "Пользователь с таким именем уже существует" });
        }

        const currentUser = await UserModel.findOne({ _id: userId });

        if (oldPassword) {
          const oldHashedPassword = await bcrypt.compare(
            oldPassword,
            currentUser.password
          );

          if (oldHashedPassword && newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 12);

            await UserModel.updateOne(
              { _id: userId },
              {
                avatar: resultFile.secure_url,
                userName: newUserName,
                password: hashedPassword,
              }
            );

            return res.status(200).json({
              avatar: resultFile.secure_url,
              message: "Данные обновлены",
              userInfo: {
                userName: newUserName,
              },
            });
          }

          await UserModel.updateOne(
            { _id: userId },
            {
              avatar: resultFile.secure_url,
              userName: newUserName,
              password: currentUser.password,
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

        await UserModel.updateOne(
          { _id: userId },
          {
            avatar: resultFile.secure_url,
            userName: newUserName,
            password: currentUser.password,
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

      const candidate = await UserModel.findOne({ userName: newUserName });

      if (candidate) {
        return res
          .status(500)
          .json({ message: "Пользователь с таким именем уже существует" });
      }

      const currentUser = await UserModel.findOne({ _id: userId });

      if (oldPassword) {
        const oldHashedPassword = await bcrypt.compare(
          oldPassword,
          currentUser.password
        );

        if (oldHashedPassword && newPassword) {
          const hashedPassword = await bcrypt.hash(newPassword, 12);

          await UserModel.updateOne(
            { _id: userId },
            {
              userName: newUserName,
              password: hashedPassword,
            }
          );

          return res.status(200).json({
            message: "Данные обновлены",
            userInfo: {
              userName: newUserName,
            },
          });
        }

        await UserModel.updateOne(
          { _id: userId },
          {
            userName: newUserName,
            password: currentUser.password,
          }
        );

        return res.status(200).json({
          message: "Данные обновлены",
          userInfo: {
            userName: newUserName,
          },
        });
      }

      await UserModel.updateOne(
        { _id: userId },
        {
          userName: newUserName,
        }
      );

      return res.status(200).json({
        message: "Данные обновлены",
        userInfo: {
          userName: newUserName,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  getMyData = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findOne({ _id: req.userId });

      return res.json({
        avatar: user.avatar,
        userId: user._id,
        userName: user.userName,
        isOnline: user.isOnline,
        wasOnline: user.wasOnline,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Не получилось получить данные Вашего профиля" });
    }
  };
}

export default UsersController;
