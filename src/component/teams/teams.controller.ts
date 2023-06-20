import { Response, Request, NextFunction } from "express";
import Team from "./teams.model";
import * as teamService from "./teams.service";
import { client } from "../../config/redis";

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const team = await teamService.create(req.body);

		return res.status(201).json({ message: "team created successfully", data: team });
	} catch (err) {
		next(err);
	}
};

export const findTeams = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const teams = await client.get("teams");
		if (teams) {
			return res.status(200).json({
				message: "teams retrieved successfully",
				data: JSON.parse(teams),
			});
		} else {
			const teams = await Team.find();
			await client.set("teams", JSON.stringify(teams), {
				EX: 60,
			});
			return res.status(200).json({
				message: "teams retrieved successfully",
				data: teams,
			});
		}
	} catch (err) {
		next(err);
	}
};

export const findTeam = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const key = `team-${req.params.id}`;
		const team = await client.get(key);
		if (team) {
			return res.status(200).json({
				message: "team retrieved successfully",
				data: JSON.parse(team),
			});
		} else {
			const team = await Team.findById(req.params.id);
			await client.set(key, JSON.stringify(team), {
				EX: 60,
			});
			return res.status(200).json({
				message: "team retrieved successfully",
				data: team,
			});
		}
	} catch (err) {
		next(err);
	}
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });

		return res.status(200).json({
			message: "team updated successfully",
			data: team,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Team.findByIdAndDelete(req.params.id);

		return res.status(200).json({
			message: "team deleted successfully",
		});
	} catch (err) {
		next(err);
	}
};
