const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
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

const Comments = mongoose.model("comments", commentSchema);

module.exports = Comments;
