import { createClient } from "redis";
import logger from "../utils/loggerHelper";

export const client = createClient();
const redis = async () => {
	client.on("error", (err) => logger.error("Redis client error", err));
	await client.connect();
	logger.info("Redis client connected");
};

export default redis;
