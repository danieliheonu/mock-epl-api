import app from "../../../app";
import request from "supertest";
import User from "../../users/users.model";

describe("POST /auth/register/admin", () => {
	test("admin can register", async () => {
		const res = await request(app).post("/api/v1/auth/register/admin").send({
			email: "admin@gmail.com",
			password: "password",
		});

		expect(res.status).toBe(201);
		expect(res.body.message).toBe("admin successfully created");
	});
	test("admin can't register with existing email", async () => {
		await User.create({
			email: "admin@gmail.com",
			password: "password",
			isAdmin: true,
		});

		const res = await request(app).post("/api/v1/auth/register/admin").send({
			email: "admin@gmail.com",
			password: "password",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("email already exists");
	});
	test("admin can't register with invalid email", async () => {
		const res = await request(app).post("/api/v1/auth/register/admin").send({
			email: "admin",
			password: "password",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"email" must be a valid email');
	});
	test("admin can't register without email", async () => {
		const res = await request(app).post("/api/v1/auth/register/admin").send({
			password: "password",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"email" is required');
	});
	test("admin can't register without password", async () => {
		const res = await request(app).post("/api/v1/auth/register/admin").send({
			email: "admin@gmail.com",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"password" is required');
	});
});

describe("POST /auth/register/user", () => {
	test("user can register", async () => {
		const res = await request(app).post("/api/v1/auth/register/user").send({
			email: "user@gmail.com",
			password: "password",
		});

		expect(res.status).toBe(201);
		expect(res.body.message).toBe("user successfully created");
	});
	test("user can't register with existing email", async () => {
		await User.create({
			email: "user@gmail.com",
			password: "password",
		});

		const res = await request(app).post("/api/v1/auth/register/user").send({
			email: "user@gmail.com",
			password: "password",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("email already exists");
	});
	test("user can't register with invalid email", async () => {
		const res = await request(app).post("/api/v1/auth/register/user").send({
			email: "user",
			password: "password",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"email" must be a valid email');
	});
	test("user can't register without email", async () => {
		const res = await request(app).post("/api/v1/auth/register/user").send({
			password: "password",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"email" is required');
	});
	test("user can't register without password", async () => {
		const res = await request(app).post("/api/v1/auth/register/user").send({
			email: "user@gmail.com",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"password" is required');
	});
});

describe("POST /auth/login", () => {
	test("user can't login with invalid email", async () => {
		const res = await request(app).post("/api/v1/auth/login").send({
			email: "user",
			password: "password",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"email" must be a valid email');
	});

	test("user can't login without email", async () => {
		const res = await request(app).post("/api/v1/auth/login").send({
			password: "password",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"email" is required');
	});

	test("user can't login without password", async () => {
		const res = await request(app).post("/api/v1/auth/login").send({
			email: "user@gmail.com",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"password" is required');
	});

	test("user can't login with an empty email", async () => {
		const res = await request(app).post("/api/v1/auth/login").send({
			email: "",
			password: "password",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"email" is not allowed to be empty');
	});
});
