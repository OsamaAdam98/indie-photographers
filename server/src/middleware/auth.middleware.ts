import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).json({ msg: "Authorization denied." });

  try {
    const decrypted = jwt.verify(token, process.env.JWT_SECRET);
    req.body = {
      ...req.body,
      user: decrypted,
    };
    next();
  } catch (e) {
    res.status(401).json({ msg: "Not a valid token" });
  }
}

export default auth;
