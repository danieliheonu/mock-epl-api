import teamsModel from "../component/teams/teams.model";
import fixturesModel from "../component/fixtures/fixtures.model";
import { Types } from "mongoose";
import { skip } from "node:test";

type Fixture = {
	homeTeamId: Types.ObjectId;
	awayTeamId: Types.ObjectId;
};

const createFixtures = async () => {
	const fixtures: Fixture[] = [];
	const teams = await teamsModel.find().select("_id");
	for (let i = 0; i < 30; i++) {
		const homeTeamId = teams[Math.floor(Math.random() * teams.length)]._id;
		const awayTeamId = teams[Math.floor(Math.random() * teams.length)]._id;
		if (homeTeamId === awayTeamId) {
			continue;
		}

		if (
			fixtures.find(
				(fixture) => fixture.homeTeamId === homeTeamId && awayTeamId === awayTeamId
			)
		) {
			continue;
		}
		fixtures.push({ homeTeamId, awayTeamId });
	}
	fixturesModel.insertMany(fixtures);
};

export default createFixtures;
