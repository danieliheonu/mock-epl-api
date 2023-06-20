import Fixtures from "../component/fixtures/fixtures.model";
import Team from "../component/teams/teams.model";

enum Fixture {
	TRUE = "true",
	FALSE = "false",
}

export type FixtureSearch = {
	team: string;
	fixture?: Fixture;
};

export const search = async (query: FixtureSearch) => {
	const { team, fixture = Fixture.FALSE } = query;

	if (team && fixture == "false") {
		const teams = Team.find({
			$or: [
				{ name: { $regex: team, $options: "i" } },
				{ location: { $regex: team, $options: "i" } },
				{ stadium: { $regex: team, $options: "i" } },
				{ manager: { $regex: team, $options: "i" } },
				{ nickname: { $regex: team, $options: "i" } },
			],
		});

		return teams;
	} else if (team && fixture == "true") {
		const fixtures = Fixtures.aggregate()
			.lookup({
				from: "teams",
				localField: "homeTeamId",
				foreignField: "_id",
				as: "homeTeam",
			})
			.lookup({
				from: "teams",
				localField: "awayTeamId",
				foreignField: "_id",
				as: "awayTeam",
			})
			.match({
				$or: [
					{ "homeTeam.name": { $regex: team, $options: "i" } },
					{ "awayTeam.name": { $regex: team, $options: "i" } },
				],
			})
			.project({
				homeTeamId: 0,
				awayTeamId: 0,
			});

		return fixtures;
	}
};
