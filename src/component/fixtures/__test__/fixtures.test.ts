import app from "../../../app";
import request from "supertest";
import Fixture from "../fixtures.model";
import Team from "../../teams/teams.model";
import { authenticateAdmin, authenticateUser, addTeams } from "../../../tests/jest.setup";

describe("GET /fixtures", () => {
	test("admin can retrieve all fixtures", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, team2, _] = await addTeams();

		await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.get("/api/v1/fixtures")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.length).toEqual(1);
	});
	test("user can't retrieve fixtures", async () => {
		const accessToken = await authenticateUser();

		const [team1, team2, _] = await addTeams();

		await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.get("/api/v1/fixtures")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(401);
		expect(res.body.message).toEqual("You are not authorized to perform this action");
	});
});

describe("POST /fixtures", () => {
	test("admin can create a fixture", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, team2, _] = await addTeams();

		const res = await request(app)
			.post("/api/v1/fixtures")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				homeTeamId: team1._id,
				awayTeamId: team2._id,
			});

		expect(res.status).toBe(201);
		expect(res.body.data.homeTeamId).toEqual(team1._id.toString());
	});

	test("user can't create a fixture", async () => {
		const accessToken = await authenticateUser();

		const [team1, team2, _] = await addTeams();

		const res = await request(app)
			.post("/api/v1/fixtures")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				homeTeamId: team1._id,
				awayTeamId: team2._id,
			});

		expect(res.status).toBe(401);
		expect(res.body.message).toEqual("You are not authorized to perform this action");
	});

	test("admin can't create a fixture without homeTeamId", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, _, __] = await addTeams();

		const res = await request(app)
			.post("/api/v1/fixtures")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				awayTeamId: team1._id,
			});

		expect(res.status).toBe(400);
		expect(res.body.message).toEqual('"homeTeamId" is required');
	});

	test("admin can't create a fixture without awayTeamId", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, _, __] = await addTeams();

		const res = await request(app)
			.post("/api/v1/fixtures")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				homeTeamId: team1._id,
			});

		expect(res.status).toBe(400);
		expect(res.body.message).toEqual('"awayTeamId" is required');
	});

	test("admin can't create a fixture that already exists", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, team2, _] = await addTeams();

		await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.post("/api/v1/fixtures")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				homeTeamId: team1._id,
				awayTeamId: team2._id,
			});

		expect(res.status).toBe(400);
		expect(res.body.message).toEqual("fixture already exists");
	});

	test("admin can't create a fixture with the same homeTeamId and awayTeamId", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, _, __] = await addTeams();

		const res = await request(app)
			.post("/api/v1/fixtures")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				homeTeamId: team1._id,
				awayTeamId: team1._id,
			});

		expect(res.status).toBe(400);
		expect(res.body.message).toEqual("home and away team cannot be the same");
	});
});

describe("GET /fixtures/:id", () => {
	test("admin can retrieve a fixture", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, team2, _] = await addTeams();

		const fixture = await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.get(`/api/v1/fixtures/${fixture._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.homeTeamId._id).toEqual(team1._id.toString());
	});

	test("user can't retrieve a fixture", async () => {
		const accessToken = await authenticateUser();

		const [team1, team2, _] = await addTeams();

		const fixture = await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.get(`/api/v1/fixtures/${fixture._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(401);
		expect(res.body.message).toEqual("You are not authorized to perform this action");
	});
});

describe("PATCH /fixtures/:id", () => {
	test("admin can update a fixture", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, team2, team3] = await addTeams();

		const fixture = await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.put(`/api/v1/fixtures/${fixture._id}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				homeTeamId: team3._id,
			});

		expect(res.status).toBe(200);
		expect(res.body.data.homeTeamId._id).toEqual(team3._id.toString());
	});

	test("user can't update a fixture", async () => {
		const accessToken = await authenticateUser();

		const [team1, team2, team3] = await addTeams();

		const fixture = await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.put(`/api/v1/fixtures/${fixture._id}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				homeTeamId: team3._id,
			});

		expect(res.status).toBe(401);
		expect(res.body.message).toEqual("You are not authorized to perform this action");
	});

	test("admin can't update a fixture to a fixture that already exists", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, team2, team3] = await addTeams();

		const [fixture, _] = await Fixture.insertMany([
			{
				homeTeamId: team1._id,
				awayTeamId: team2._id,
			},
			{
				homeTeamId: team3._id,
				awayTeamId: team2._id,
			},
		]);

		const res = await request(app)
			.put(`/api/v1/fixtures/${fixture._id}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				homeTeamId: team3._id,
			});

		expect(res.status).toBe(400);
		expect(res.body.message).toEqual("fixture already exists");
	});

	test("admin can't update a fixture with the same home and away team", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, team2, _] = await addTeams();

		const fixture = await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.put(`/api/v1/fixtures/${fixture._id}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				awayTeamId: team1._id,
			});

		expect(res.status).toBe(400);
		expect(res.body.message).toEqual("home and away team cannot be the same");
	});
});

describe("DELETE /fixtures/:id", () => {
	test("admin can delete a fixture", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, team2, _] = await addTeams();

		const fixture = await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.delete(`/api/v1/fixtures/${fixture._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.message).toEqual("fixture deleted successfully");
	});

	test("user can't delete a fixture", async () => {
		const accessToken = await authenticateUser();

		const [team1, team2, _] = await addTeams();

		const fixture = await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.delete(`/api/v1/fixtures/${fixture._id}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(401);
		expect(res.body.message).toEqual("You are not authorized to perform this action");
	});
});

describe("PUT /fixtures/:id/generate-link", () => {
	test("admin can generate link for fixture", async () => {
		const accessToken = await authenticateAdmin();

		const [team1, team2, _] = await addTeams();

		const fixture = await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.put(`/api/v1/fixtures/${fixture._id}/generate-link`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("link");
	});

	test("user can't generate link for fixture", async () => {
		const accessToken = await authenticateUser();

		const [team1, team2, _] = await addTeams();

		const fixture = await Fixture.create({
			homeTeamId: team1._id,
			awayTeamId: team2._id,
		});

		const res = await request(app)
			.put(`/api/v1/fixtures/${fixture._id}/generate-link`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(401);
		expect(res.body.message).toEqual("You are not authorized to perform this action");
	});
});

describe("GET /fixtures/pending", () => {
	test("user can retrieve pending fixtures", async () => {
		const accessToken = await authenticateUser();

		const [team1, team2, team3] = await addTeams();

		await Fixture.insertMany([
			{
				homeTeamId: team1._id,
				awayTeamId: team2._id,
			},
			{
				homeTeamId: team1._id,
				awayTeamId: team3._id,
			},
			{
				homeTeamId: team2._id,
				awayTeamId: team3._id,
				status: "completed",
			},
		]);

		const res = await request(app)
			.get("/api/v1/fixtures/pending")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.length).toBe(2);
	});
});

describe("GET /fixtures/completed", () => {
	test("user can retrieve completed fixtures", async () => {
		const accessToken = await authenticateUser();

		const [team1, team2, team3] = await addTeams();

		await Fixture.insertMany([
			{
				homeTeamId: team1._id,
				awayTeamId: team2._id,
			},
			{
				homeTeamId: team1._id,
				awayTeamId: team3._id,
			},
			{
				homeTeamId: team2._id,
				awayTeamId: team3._id,
				status: "completed",
			},
		]);

		const res = await request(app)
			.get("/api/v1/fixtures/completed")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(res.status).toBe(200);
		expect(res.body.data.length).toBe(1);
	});
});

describe("GET /search", () => {
	test("user can robustly search for team", async () => {
		await addTeams();

		const res = await request(app).get("/api/v1/search?team=te");

		expect(res.status).toBe(200);
		expect(res.body.data.length).toBe(3);
	});

	test("users can robustly search for fixtures", async () => {
		const [team1, team2, team3] = await addTeams();

		await Fixture.insertMany([
			{
				homeTeamId: team1._id,
				awayTeamId: team2._id,
			},
			{
				homeTeamId: team3._id,
				awayTeamId: team1._id,
			},
			{
				homeTeamId: team2._id,
				awayTeamId: team3._id,
				status: "completed",
			},
		]);

		const res = await request(app).get("/api/v1/search?team=team1&fixture=true");

		expect(res.status).toBe(200);
		expect(res.body.data.length).toBe(2);
	});
});
