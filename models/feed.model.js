const mongoose = require("mongoose");

const feedSchema = mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: "users",
		required: true
	},
	msg: {
		type: String,
		required: false
	},
	photo: {
		type: String,
		required: false
	},
	photoId: {
		type: String,
		required: false
	},
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

const Feed = mongoose.model("feed", feedSchema);

module.exports = Feed;
