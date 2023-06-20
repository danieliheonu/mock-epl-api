import { Response, Request, NextFunction } from "express";
import User from "./users.model";
import * as userService from "./users.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const token = await userService.login(email, password);

		return res.status(200).json({
			message: "login successful",
			token,
		});
	} catch (err: any) {
		next(err);
	}
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await userService.createUser(req.body);

		return res.status(201).json({
			message: "user successfully created",
		});
	} catch (err) {
		next(err);
	}
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		req.body.isAdmin = true;
		await userService.createUser(req.body);

		return res.status(201).json({
			message: "admin successfully created",
		});
	} catch (err) {
		next(err);
	}
};
