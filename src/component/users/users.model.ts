import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { schemaOptions } from "../../utils/mixins";

export interface IUser {
	_id?: Types.ObjectId;
	email: string;
	isAdmin: boolean;
	password: string;
	comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			lowercase: true,
			required: true,
			trim: true,
			unique: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		password: {
			type: String,
			required: true,
		},
	},
	schemaOptions
);

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}

	next();
});

userSchema.methods.comparePassword = async function (password: string) {
	return await bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);
