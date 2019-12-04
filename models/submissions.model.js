const mongoose = require("mongoose");

const submissionSchema = mongoose.Schema({
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
