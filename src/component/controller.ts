import { search as searchService, FixtureSearch } from "./service";
import { Request, Response, NextFunction } from "express";
import { client } from "../config/redis";

export const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const key = `search-${req.query.team}-${req.query.fixture ?? "false"}`;
		const results = await client.get(key);
		if (results) {
			return res.status(200).json({
				message: "results retrieved successfully",
				data: JSON.parse(results),
			});
		} else {
			const results = await searchService(req.query as FixtureSearch);

			await client.set(key, JSON.stringify(results), {
				EX: 60,
			});

			return res.status(200).json({
				message: "results retrieved successfully",
				data: results,
			});
		}
	} catch (err) {
		next(err);
	}
};
