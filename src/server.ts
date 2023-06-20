import "dotenv/config";
import app from "./app";
import db from "./config/db";
import redis from "./config/redis";
import logger from "./utils/loggerHelper";

db();

redis();

app.listen(process.env.PORT, () => {
	logger.info(`Server is running on port ${process.env.PORT}`);
});
