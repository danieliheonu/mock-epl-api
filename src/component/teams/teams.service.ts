import { BadRequestException } from "../../utils/serviceException";
import Team from "./teams.model";

type TeamInput = {
	name: string;
	stadium: string;
	location?: string;
	manager?: string;
	nickname?: string;
};

export const create = async (body: TeamInput) => {
	const teamExists = await Team.exists({ name: body.name });
	if (teamExists) throw new BadRequestException("team already exists");

	const team = await Team.create(body);

	return team;
};
