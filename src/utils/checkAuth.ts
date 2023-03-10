import { NextFunction, Request, Response } from "express";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const jwt = require("jsonwebtoken");

  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Нет авторизации" });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
      req.userId = decoded.userId;

      next();
    }
  } catch (err) {
    res.status(500).json({ message: "Нет авторизации" });
  }
};

export default checkAuth;
