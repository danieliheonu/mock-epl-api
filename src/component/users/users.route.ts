import { login, createUser, createAdmin } from "./users.controller";
import { Router } from "express";
import { validateLogin, validateCreateUser, validateCreateAdmin } from "./users.validation";

const userRouter = Router();

userRouter.post("/login", validateLogin, login);
userRouter.post("/register/user", validateCreateUser, createUser);
userRouter.post("/register/admin", validateCreateAdmin, createAdmin);

export default userRouter;
