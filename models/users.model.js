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
		default:
			"https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-7.png"
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
	},
	posts: [
		{
			type: mongoose.Types.ObjectId,
			ref: "feed"
		}
	]
});

const User = mongoose.model("users", userSchema);

module.exports = User;
