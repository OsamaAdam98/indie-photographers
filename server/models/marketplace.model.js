const mongoose = require("mongoose");

const marketSchema = mongoose.Schema({
	img: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	}
});

const Market = mongoose.model("marketplace", marketSchema);

module.exports = Market;
