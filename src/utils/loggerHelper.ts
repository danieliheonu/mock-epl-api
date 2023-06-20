import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;

const myFormat = printf((info) => {
	return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
	level: process.env.LOG_LEVEL,
	format: combine(label({ label: process.env.APP_NAME }), timestamp(), myFormat),
	transports: [
		new transports.File({ filename: "error.log", level: "error" }),
		new transports.File({ filename: "combined.log" }),
	],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new transports.Console({
			format: combine(label({ label: process.env.APP_NAME }), timestamp(), myFormat),
		})
	);
}

export default logger;
