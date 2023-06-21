import { createClient } from "redis";

const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT) || 6379;
const tls = process.env.REDIS_TLS;

const options = {
	url: `${tls}://${host}:${port}`,
};

export const client = createClient(options);
const redis = async () => {
	client.on("error", (err) => console.log("Redis client error", err));
	await client.connect();
	console.log("Redis client connected");
};

export default redis;
