import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../component/users/users.model";
import Team from "../component/teams/teams.model";
import jwt from "jsonwebtoken";

let mongo: MongoMemoryServer;

beforeAll(async () => {
	mongo = await MongoMemoryServer.create();
	const uri = mongo.getUri();

	await mongoose.connect(uri);
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (const collection of collections) {
		collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.connection.close();
	await mongo.stop();
});

export const authenticateAdmin = async (): Promise<string> => {
	const user = await User.create({
		email: "user@gmail.com",
		password: "password",
		isAdmin: true,
	});

	const accessToken = jwt.sign({ _id: user._id, admin: user.isAdmin }, process.env.JWT_SECRET!);

	return accessToken;
};

export const authenticateUser = async (): Promise<string> => {
	const user = await User.create({
		email: "user@gmail.com",
		password: "password",
		isAdmin: false,
	});

	const accessToken = jwt.sign({ _id: user._id, admin: user.isAdmin }, process.env.JWT_SECRET!);

	return accessToken;
};

export const addTeams = async () => {
	return await Team.insertMany([
		{
			name: "team1",
			stadium: "stadium1",
		},
		{
			name: "team2",
			stadium: "stadium2",
		},
		{
			name: "team3",
			stadium: "stadium3",
		},
	]);
};
