import User from "./users.model";
import jwt from "jsonwebtoken";
import { BadRequestException, NotFoundException } from "../../utils/serviceException";

type UserInput = {
	email: string;
	password: string;
	isAdmin?: boolean;
};

export const login = async (email: string, password: string) => {
	const user = await User.findOne({ email });
	if (!user) throw new NotFoundException("user not found");

	const validPassword = await user.comparePassword(password);
	if (!validPassword) throw new BadRequestException("incorrect password");

	const accessToken = jwt.sign(
		{ _id: user._id, admin: user.isAdmin },
		process.env.JWT_SECRET as string,
		{
			expiresIn: "24h",
		}
	);

	return accessToken;
};

export const createUser = async (body: UserInput) => {
	const userExists = await User.exists({ email: body.email });
	if (userExists) throw new BadRequestException("email already exists");

	const user = await User.create(body);

	return user;
};
