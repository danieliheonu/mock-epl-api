import { Schema, model, Types } from "mongoose";
import { schemaOptions } from "../../utils/mixins";

enum FixtureStatus {
	PENDING = "pending",
	COMPLETED = "completed",
}

interface FixtureDocument {
	homeTeamId: Types.ObjectId;
	awayTeamId: Types.ObjectId;
	status?: FixtureStatus;
	link?: string;
}

const fixtureSchema = new Schema<FixtureDocument>(
	{
		homeTeamId: {
			type: Schema.Types.ObjectId,
			ref: "Team",
			required: true,
		},
		awayTeamId: {
			type: Schema.Types.ObjectId,
			ref: "Team",
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(FixtureStatus),
			default: FixtureStatus.PENDING,
		},
		link: {
			type: String,
			trim: true,
		},
	},
	schemaOptions
);

fixtureSchema.index({ status: 1 });

fixtureSchema.virtual("homeTeam", {
	ref: "Team",
	localField: "homeTeam",
	foreignField: "_id",
	justOne: true,
});

fixtureSchema.virtual("awayTeam", {
	ref: "Team",
	localField: "awayTeam",
	foreignField: "_id",
	justOne: true,
});

export default model<FixtureDocument>("Fixture", fixtureSchema);
