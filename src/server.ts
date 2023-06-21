import "dotenv/config";
import app from "./app";
import db from "./config/db";
import redis from "./config/redis";

app.listen(process.env.PORT, async () => {
	console.log(`Server is running on port ${process.env.PORT}`);
	await db();
	await redis();
});
