import express, { Express, Request, Response } from "express";
import cors from "cors";
import errorHandler from "./middleware/exceptionFilter";
import route from "./component/routes";

const app: Express = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
	res.send("Mock Premier League server is up and running! 🚀");
});

app.use("/api/v1", route);
app.use(errorHandler);

export default app;
