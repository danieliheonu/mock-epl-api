import Fixtures from "./fixtures.model";
import Team from "../teams/teams.model";
import { BadRequestException, NotFoundException } from "../../utils/serviceException";

type FixtureInput = {
	homeTeamId: string;
	awayTeamId: string;
};

enum FixtureStatus {
	PENDING = "pending",
	COMPLETED = "completed",
}

type FixtureUpdateInput = {
	homeTeamId?: string;
	awayTeamId?: string;
	status?: FixtureStatus;
	link?: string;
};

export const create = async (body: FixtureInput) => {
	const { homeTeamId, awayTeamId } = body;

	const homeTeam = await Team.findById(homeTeamId);
	const awayTeam = await Team.findById(awayTeamId);

	if (!homeTeam || !awayTeam) {
		throw new NotFoundException("team not found");
	}

	const fixtureExists = await Fixtures.exists({ homeTeamId, awayTeamId });
	if (fixtureExists) throw new BadRequestException("fixture already exists");

	if (homeTeamId === awayTeamId)
		throw new BadRequestException("home and away team cannot be the same");

	const fixture = await Fixtures.create({
		homeTeamId,
		awayTeamId,
	});

	return fixture;
};

export const update = async (id: string, body: FixtureUpdateInput) => {
	const fixtureExists = await Fixtures.findById(id);

	if (body.homeTeamId) {
		const homeTeam = await Team.findById(body.homeTeamId);
		if (!homeTeam) throw new NotFoundException("team not found");

		if (body.homeTeamId === fixtureExists?.awayTeamId.toString())
			throw new BadRequestException("home and away team cannot be the same");

		const fixtureExist = await Fixtures.exists({
			homeTeamId: body.homeTeamId,
			awayTeamId: fixtureExists?.awayTeamId,
		});
		if (fixtureExist) throw new BadRequestException("fixture already exists");
	}

	if (body.awayTeamId) {
		const awayTeam = await Team.findById(body.awayTeamId);
		if (!awayTeam) throw new NotFoundException("team not found");

		if (body.awayTeamId === fixtureExists?.homeTeamId.toString())
			throw new BadRequestException("home and away team cannot be the same");

		const fixtureExist = await Fixtures.exists({
			homeTeamId: fixtureExists?.homeTeamId,
			awayTeamId: body.awayTeamId,
		});
		if (fixtureExist) throw new BadRequestException("fixture already exists");
	}

	if (body.homeTeamId && body.awayTeamId && body.homeTeamId === body.awayTeamId)
		throw new BadRequestException("home and away team cannot be the same");

	if (body.homeTeamId && body.awayTeamId) {
		const fixtureExist = await Fixtures.exists({
			homeTeamId: body.homeTeamId,
			awayTeamId: body.awayTeamId,
		});
		if (fixtureExist) throw new BadRequestException("fixture already exists");
	}

	const fixture = await Fixtures.findByIdAndUpdate(id, body, { new: true }).populate([
		{
			path: "homeTeamId",
			select: { name: 1, stadium: 1, _id: 1 },
		},
		{
			path: "awayTeamId",
			select: { name: 1, _id: 1 },
		},
	]);

	return fixture;
};

export const generateLink = async (id: string) => {
	const link = Math.random().toString(20).substring(2, 10);

	await Fixtures.findByIdAndUpdate(id, { link });

	return link;
};
