import mongoose, { ConnectOptions } from "mongoose";
import logger from "../utils/loggerHelper";

const db = async () => {
	try {
		await mongoose.connect(
			process.env.MONGO_URI as string,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			} as ConnectOptions
		),
			logger.info("Connected to database");
	} catch (err) {
		logger.error(err);
	}
};

export default db;
