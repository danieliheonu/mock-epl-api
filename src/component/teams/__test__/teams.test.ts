import app from "../../../app";
import request from "supertest";
import { authenticateAdmin, authenticateUser, addTeams } from "../../../tests/jest.setup";

describe("GET /teams", () => {
	test("admin can retrieve all teams", async () => {
		const accessToken = await authenticateAdmin();

		await addTeams();

		const res = await request(app)
			.get("/api/v1/teams")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.length).toEqual(3);
		expect(res.body.message).toEqual("teams retrieved successfully");
	});
	test("user can retrieve all teams", async () => {
		const accessToken = await authenticateUser();

		await addTeams();

		const res = await request(app)
			.get("/api/v1/teams")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.length).toEqual(3);
		expect(res.body.message).toEqual("teams retrieved successfully");
	});
});

describe("POST /teams", () => {
	test("admin can create a team", async () => {
		const accessToken = await authenticateAdmin();

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
		const accessToken = await authenticateAdmin();

		await addTeams();

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
		const accessToken = await authenticateUser();

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
		const accessToken = await authenticateAdmin();

		const [team1, _, __] = await addTeams();

		const res = await request(app)
			.get(`/api/v1/teams/${team1._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.name).toEqual("team1");
	});
	test("user can't retrieve a team", async () => {
		const accessToken = await authenticateUser();

		const [team1, _, __] = await addTeams();

		const res = await request(app)
			.get(`/api/v1/teams/${team1._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.name).toEqual("team1");
	});
});

describe("PUT /teams/:id", () => {
	test("admin can update a team", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, _, __] = await addTeams();

		const res = await request(app)
			.put(`/api/v1/teams/${team1._id}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				name: "team4",
			});

		expect(res.status).toBe(200);
		expect(res.body.data.name).toEqual("team4");
	});
	test("user can't update a team", async () => {
		const accessToken = await authenticateUser();

		const [team1, _, __] = await addTeams();

		const res = await request(app)
			.put(`/api/v1/teams/${team1._id}`)
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
		const accessToken = await authenticateAdmin();

		const [team1, _, __] = await addTeams();

		const res = await request(app)
			.delete(`/api/v1/teams/${team1._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.message).toEqual("team deleted successfully");
	});
	test("user can't delete a team", async () => {
		const accessToken = await authenticateUser();

		const [team1, _, __] = await addTeams();

		const res = await request(app)
			.delete(`/api/v1/teams/${team1._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(401);
		expect(res.body.message).toEqual("You are not authorized to perform this action");
	});
});
