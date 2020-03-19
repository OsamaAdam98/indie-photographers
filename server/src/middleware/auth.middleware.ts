import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

function auth(req: Request, res: Response, next: NextFunction) {
	const token = req.header("x-auth-token");

	if (!token) return res.status(401).json({ msg: "Authorization denied." });

	try {
		const decrypted = jwt.verify(token, process.env.jwtSecret);
		req.body = {
			...req.body,
			user: decrypted
		};
		next();
	} catch (e) {
		res.status(401).json({ msg: "Not a valid token" });
	}
}

export default auth;
