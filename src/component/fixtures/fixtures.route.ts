import { Router } from "express";
import { validateCreateFixture, validateUpdateFixture } from "./fixtures.validation";
import * as fixtureController from "./fixtures.controller";
import jwt, { isAdmin } from "../../middleware/verifyToken";
import limiter from "../../middleware/limiter";

const fixtureRouter = Router();

fixtureRouter.post("/", jwt, isAdmin, validateCreateFixture, fixtureController.create);
fixtureRouter.get("/", jwt, isAdmin, fixtureController.findFixtures);
fixtureRouter.get("/pending", jwt, limiter, fixtureController.findPendingFixtures);
fixtureRouter.get("/completed", jwt, limiter, fixtureController.findCompletedFixtures);
fixtureRouter.get("/:id", jwt, isAdmin, fixtureController.findFixture);
fixtureRouter.put("/:id", jwt, isAdmin, validateUpdateFixture, fixtureController.updateFixture);
fixtureRouter.put("/:id/generate-link", jwt, isAdmin, fixtureController.generateFixtureLink);
fixtureRouter.delete("/:id", jwt, isAdmin, fixtureController.deleteFixture);

export default fixtureRouter;
