import { Schema, model } from "mongoose";
import { schemaOptions } from "../../utils/mixins";

interface TeamDocument {
	name: string;
	stadium: string;
	location?: string;
	manager?: string;
	nickname?: string;
}

const teamSchema = new Schema<TeamDocument>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},
		stadium: {
			type: String,
			required: true,
			trim: true,
		},
		location: {
			type: String,
			trim: true,
		},
		manager: {
			type: String,
			trim: true,
		},
		nickname: {
			type: String,
			trim: true,
		},
	},
	schemaOptions
);

export default model<TeamDocument>("Team", teamSchema);
