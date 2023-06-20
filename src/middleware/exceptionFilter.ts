import { Request, Response, NextFunction } from "express";
import { ServiceError } from "../utils/serviceException";
import ej from "express-jwt";
import ev from "express-validation";
import logger from "../utils/loggerHelper";

export default function exceptionFilter(
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	if (err.name === "UnauthorizedError") {
		let error = err as ej.UnauthorizedError;
		return res.status(error.status).json({
			message: error.inner.message,
		});
	}

	if (err instanceof ev.ValidationError) {
		return res.status(err.statusCode).json({
			message: (err.details.body![0] as any).message,
		});
	}

	if (err instanceof ServiceError) {
		return res.status(err.code).json({
			message: err.message,
		});
	}

	logger.error(err.message);

	if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
		return res.status(500).send({
			message: "Something went wrong while processing your request",
		});
	} else {
		return res.status(500).send({
			message: err.message,
		});
	}
}
