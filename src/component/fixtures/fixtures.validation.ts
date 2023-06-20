import { validate, Joi } from "express-validation";

export const validateCreateFixture = validate({
	body: Joi.object({
		homeTeamId: Joi.string().required(),
		awayTeamId: Joi.string().required(),
	}),
});

export const validateUpdateFixture = validate({
	body: Joi.object({
		homeTeamId: Joi.string(),
		awayTeamId: Joi.string(),
		status: Joi.string(),
	}),
});
