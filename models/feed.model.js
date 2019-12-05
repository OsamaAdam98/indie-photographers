const mongoose = require("mongoose");

const feedSchema = mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	msg: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const Feed = mongoose.model("feed", feedSchema);

module.exports = Feed;
