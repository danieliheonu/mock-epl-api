import { validate, Joi } from "express-validation";

export const validateCreateTeam = validate({
	body: Joi.object({
		name: Joi.string().required(),
		stadium: Joi.string().required(),
		location: Joi.string(),
		manager: Joi.string(),
		nickname: Joi.string(),
	}),
});

export const validateUpdateTeam = validate({
	body: Joi.object({
		name: Joi.string(),
		stadium: Joi.string(),
		location: Joi.string(),
		manager: Joi.string(),
		nickname: Joi.string(),
	}),
});
