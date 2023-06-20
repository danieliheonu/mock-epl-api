import { Router } from "express";
import { validateCreateTeam, validateUpdateTeam } from "./teams.validation";
import { create, findTeams, findTeam, updateTeam, deleteTeam } from "./teams.controller";
import jwt, { isAdmin } from "../../middleware/verifyToken";
import limiter from "../../middleware/limiter";

const teamRouter = Router();

teamRouter.post("/", jwt, isAdmin, validateCreateTeam, create);
teamRouter.get("/", jwt, limiter, findTeams);
teamRouter.get("/:id", jwt, limiter, findTeam);
teamRouter.put("/:id", jwt, isAdmin, validateUpdateTeam, updateTeam);
teamRouter.delete("/:id", jwt, isAdmin, deleteTeam);

export default teamRouter;
