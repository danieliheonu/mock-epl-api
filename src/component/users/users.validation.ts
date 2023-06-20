import { validate, Joi } from "express-validation";

export const validateLogin = validate({
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
});

export const validateCreateUser = validate({
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
});
export const validateCreateAdmin = validate({
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
});
