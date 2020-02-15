import mongoose from "mongoose";
import {User} from "./users.model";
import {Post} from "./feed.model";
import {Like} from "./likes.model";

const commentSchema: mongoose.Schema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: "users",
		required: true
	},
	msg: {
		type: String,
		required: true
	},
	photo: {
		type: String,
		required: false
	},
	likes: [
		{
			type: mongoose.Types.ObjectId,
			ref: "likes"
		}
	],
	post: {
		type: mongoose.Types.ObjectId,
		ref: "feed",
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

export interface Comment extends mongoose.Document {
	user: User;
	msg: string;
	photo: Photo | string;
	likes: Like;
	post: Post;
	date: Date;
}

export default mongoose.model<Comment>("comments", commentSchema);
