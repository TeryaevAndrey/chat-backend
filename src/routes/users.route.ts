import { Request, Response, Router as RouterType } from "express";

const Router = require("express");
const User = require("../models/User");

const router: RouterType = Router();

router.get("/users-search", async (req: Request, res: Response) => {
  try {
    const searchStr: string = String(req.query.q);

    const user = await User.findOne({ name: searchStr });

    const total = await User.countDocuments();

    res.json({ message: "Пользователи, которых мы нашли", user, total });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/all-users", async (req: Request, res: Response) => {
  try {
    const limit: number = Number(req.query.limit);

    const users = await User.find().limit(limit);

    const total = await User.countDocuments();

    res.json({ message: "Пользователи, которых мы нашли", users, total });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;