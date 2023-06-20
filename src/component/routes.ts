import { Router } from "express";
import userRouter from "./users/users.route";
import teamRouter from "./teams/teams.route";
import fixtureRouter from "./fixtures/fixtures.route";
import { validateSearch } from "./validation";
import { search } from "./controller";
import limiter from "../middleware/limiter";

const route = Router();

route.use("/auth", userRouter);
route.use("/teams", teamRouter);
route.use("/fixtures", fixtureRouter);
route.use("/search", limiter, validateSearch, search);

export default route;
