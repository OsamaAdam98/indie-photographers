const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: "users",
		required: true
	},
	post: {
		type: mongoose.Types.ObjectId,
		ref: "feed",
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	state: {
		type: Boolean,
		default: false
	}
});

const Likes = mongoose.model("likes", likeSchema);

module.exports = Likes;
