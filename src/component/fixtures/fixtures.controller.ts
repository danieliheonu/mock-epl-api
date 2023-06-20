import Fixtures from "./fixtures.model";
import { Response, Request, NextFunction } from "express";
import * as fixtureService from "./fixtures.service";
import { client } from "../../config/redis";

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const fixture = await fixtureService.create(req.body);

		return res.status(201).json({ message: "fixture created successfully", data: fixture });
	} catch (err) {
		next(err);
	}
};

export const findFixtures = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const fixtures = await client.get("fixtures");
		if (fixtures) {
			return res.status(200).json({
				message: "fixtures retrieved successfully",
				data: JSON.parse(fixtures),
			});
		} else {
			const fixtures = await Fixtures.find().populate([
				{
					path: "homeTeamId",
					select: { name: 1, stadium: 1, _id: 1 },
				},
				{
					path: "awayTeamId",
					select: { name: 1, _id: 1 },
				},
			]);

			await client.set("fixtures", JSON.stringify(fixtures), {
				EX: 60,
			});

			return res.status(200).json({
				message: "fixtures retrieved successfully",
				data: fixtures,
			});
		}
	} catch (err) {
		next(err);
	}
};

export const findFixture = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const key = `fixture-${req.params.id}`;
		const fixture = await client.get(key);
		if (fixture) {
			return res.status(200).json({
				message: "fixture retrieved successfully",
				data: JSON.parse(fixture),
			});
		} else {
			const fixture = await Fixtures.findById(req.params.id).populate([
				{
					path: "homeTeamId",
					select: { name: 1, stadium: 1, _id: 1 },
				},
				{
					path: "awayTeamId",
					select: { name: 1, _id: 1 },
				},
			]);

			await client.set(key, JSON.stringify(fixture), {
				EX: 60,
			});

			return res.status(200).json({
				message: "fixture retrieved successfully",
				data: fixture,
			});
		}
	} catch (err) {
		next(err);
	}
};

export const updateFixture = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const fixture = await fixtureService.update(req.params.id, req.body);

		return res.status(200).json({
			message: "fixture updated successfully",
			data: fixture,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteFixture = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Fixtures.findByIdAndDelete(req.params.id);

		return res.status(200).json({
			message: "fixture deleted successfully",
		});
	} catch (err) {
		next(err);
	}
};

export const generateFixtureLink = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const link = await fixtureService.generateLink(req.params.id);

		return res.status(200).json({
			message: "fixture link generated successfully",
			link: `${process.env.BASE_URL}/fixtures/${link}`,
		});
	} catch (err) {
		next(err);
	}
};

export const findPendingFixtures = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const key = `pending-fixtures`;
		const fixtures = await client.get(key);
		if (fixtures) {
			return res.status(200).json({
				message: "fixtures retrieved successfully",
				data: JSON.parse(fixtures),
			});
		} else {
			const fixtures = await Fixtures.find({ status: "pending" }).populate([
				{
					path: "homeTeamId",
					select: { name: 1, stadium: 1, _id: 1 },
				},
				{
					path: "awayTeamId",
					select: { name: 1, _id: 1 },
				},
			]);

			await client.set(key, JSON.stringify(fixtures), {
				EX: 60,
			});

			return res.status(200).json({
				message: "fixtures retrieved successfully",
				data: fixtures,
			});
		}
	} catch (err) {
		next(err);
	}
};

export const findCompletedFixtures = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const key = `completed-fixtures`;
		const fixtures = await client.get(key);
		if (fixtures) {
			return res.status(200).json({
				message: "fixtures retrieved successfully",
				data: JSON.parse(fixtures),
			});
		} else {
			const fixtures = await Fixtures.find({ status: "completed" }).populate([
				{
					path: "homeTeamId",
					select: { name: 1, stadium: 1, _id: 1 },
				},
				{
					path: "awayTeamId",
					select: { name: 1, _id: 1 },
				},
			]);

			await client.set(key, JSON.stringify(fixtures), {
				EX: 60,
			});

			return res.status(200).json({
				message: "fixtures retrieved successfully",
				data: fixtures,
			});
		}
	} catch (err) {
		next(err);
	}
};
