import app from "../../../app";
import request from "supertest";
import User from "../../users/users.model";
import jwt from "jsonwebtoken";
import Team from "../teams.model";

describe("GET /teams", () => {
	test("admin can retrieve all teams", async () => {
		const user = await User.create({
			email: "admin@gmail.com",
			password: "password",
			isAdmin: true,
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		await Team.create({
			name: "team1",
			stadium: "stadium1",
		});

		const res = await request(app)
			.get("/api/v1/teams")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.length).toEqual(1);
		expect(res.body.message).toEqual("teams retrieved successfully");
	});
	test("user can retrieve all teams", async () => {
		const user = await User.create({
			email: "user@gmail.com",
			password: "password",
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		await Team.create({
			name: "team1",
			stadium: "stadium1",
		});

		const res = await request(app)
			.get("/api/v1/teams")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.length).toEqual(1);
		expect(res.body.message).toEqual("teams retrieved successfully");
	});
});

describe("POST /teams", () => {
	test("admin can create a team", async () => {
		const user = await User.create({
			email: "admin@gmail.com",
			password: "password",
			isAdmin: true,
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		const res = await request(app)
			.post("/api/v1/teams")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				name: "team1",
				stadium: "stadium1",
			});

		expect(res.status).toBe(201);
		expect(res.body.data.name).toEqual("team1");
	});

	test("admin cannot create a team with a name that already exists", async () => {
		const user = await User.create({
			email: "admin@gmail.com",
			password: "password",
			isAdmin: true,
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		await Team.create({
			name: "team1",
			stadium: "stadium1",
		});

		const res = await request(app)
			.post("/api/v1/teams")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				name: "team1",
				stadium: "stadium1",
			});

		expect(res.status).toBe(400);
		expect(res.body.message).toEqual("team already exists");
	});

	test("user cannot create a team", async () => {
		const user = await User.create({
			email: "user@gmail.com",
			password: "password",
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		const res = await request(app)
			.post("/api/v1/teams")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				name: "team1",
				stadium: "stadium1",
			});

		expect(res.status).toBe(401);
		expect(res.body.message).toEqual("You are not authorized to perform this action");
	});
});

describe("GET /teams/:id", () => {
	test("admin can retrieve a team", async () => {
		const user = await User.create({
			email: "admin@gmail.com",
			password: "password",
			isAdmin: true,
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		const team = await Team.create({
			name: "team1",
			stadium: "stadium1",
		});

		const res = await request(app)
			.get(`/api/v1/teams/${team._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.name).toEqual("team1");
	});
	test("user can't retrieve a team", async () => {
		const user = await User.create({
			email: "user@gmail.com",
			password: "password",
			isAdmin: false,
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		const team = await Team.create({
			name: "team1",
			stadium: "stadium1",
		});

		const res = await request(app)
			.get(`/api/v1/teams/${team._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.name).toEqual("team1");
	});
});

describe("PUT /teams/:id", () => {
	test("admin can update a team", async () => {
		const user = await User.create({
			email: "admin@gmail.com",
			password: "password",
			isAdmin: true,
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		const team = await Team.create({
			name: "team1",
			stadium: "stadium1",
		});

		const res = await request(app)
			.put(`/api/v1/teams/${team._id}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				name: "team2",
			});

		expect(res.status).toBe(200);
		expect(res.body.data.name).toEqual("team2");
	});
	test("user can't update a team", async () => {
		const user = await User.create({
			email: "user@gmail.com",
			password: "password",
			isAdmin: false,
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		const team = await Team.create({
			name: "team1",
			stadium: "stadium1",
		});

		const res = await request(app)
			.put(`/api/v1/teams/${team._id}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				name: "team2",
			});

		expect(res.status).toBe(401);
		expect(res.body.message).toEqual("You are not authorized to perform this action");
	});
});

describe("DELETE /teams/:id", () => {
	test("admin can delete a team", async () => {
		const user = await User.create({
			email: "admin@gmail.com",
			password: "password",
			isAdmin: true,
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		const team = await Team.create({
			name: "team1",
			stadium: "stadium1",
		});

		const res = await request(app)
			.delete(`/api/v1/teams/${team._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.message).toEqual("team deleted successfully");
	});
	test("user can't delete a team", async () => {
		const user = await User.create({
			email: "user@gmail.com",
			password: "password",
			isAdmin: false,
		});

		const accessToken = jwt.sign(
			{ _id: user._id, admin: user.isAdmin },
			process.env.JWT_SECRET!
		);

		const team = await Team.create({
			name: "team1",
			stadium: "stadium1",
		});

		const res = await request(app)
			.delete(`/api/v1/teams/${team._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(401);
		expect(res.body.message).toEqual("You are not authorized to perform this action");
	});
});
