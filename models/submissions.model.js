const mongoose = require("mongoose");

const submissionSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
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

const Submissions = mongoose.model("Submissions", submissionSchema);

module.exports = Submissions;
