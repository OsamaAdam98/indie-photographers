import mongoose from "mongoose";
import {User} from "./users.model";
import {Like} from "./likes.model";

const feedSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: "users",
		required: true
	},
	msg: {
		type: String,
		required: false
	},
	photo: {},
	likes: [
		{
			type: mongoose.Types.ObjectId,
			ref: "likes"
		}
	],
	comments: [
		{
			type: mongoose.Types.ObjectId,
			ref: "comments"
		}
	],
	date: {
		type: Date,
		default: Date.now
	}
});

export interface Post extends mongoose.Document {
	user: User;
	msg: string;
	photo: Photo;
	photoId?: string;
	likes: Like[];
	comments: Comment[];
	date: Date;
}

export default mongoose.model<Post>("feed", feedSchema);
