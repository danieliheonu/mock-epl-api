import { validate, Joi } from "express-validation";

export const validateSearch = validate({
	query: Joi.object({
		team: Joi.string().required(),
		fixture: Joi.string(),
	}),
});
