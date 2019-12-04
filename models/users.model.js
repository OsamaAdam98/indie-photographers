const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	profilePicture: {
		type: String,
		required: false,
		default: "https://i.imgur.com/MOPs2Ls.jpg"
	},
	password: {
		type: String,
		required: true
	},
	registerDate: {
		type: Date,
		default: Date.now
	},
	admin: {
		type: Boolean,
		default: false
	}
});

const User = mongoose.model("users", userSchema);

module.exports = User;
