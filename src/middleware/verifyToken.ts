import { expressjwt, Request } from "express-jwt";
import { NextFunction, Response } from "express";
import { UnauthorizedException } from "../utils/serviceException";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	if (!req.auth?.admin)
		throw new UnauthorizedException("You are not authorized to perform this action");
	next();
};

export default expressjwt({ secret: process.env.JWT_SECRET as string, algorithms: ["HS256"] });
