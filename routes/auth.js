const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
let Users = require("../models/users.model");

const auth = require("../middleware/auth.middleware");

router.post("/", (req, res) => {
	const {email, password} = req.body;
	if (!email || !password) {
		return res.status(400).json({msg: "Please enter all fields"});
	}
	Users.findOne({email}).then((user) => {
		if (!user) return res.status(400).json({msg: "User doesn't exist."});
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch) return res.status(400).json({msg: "Invalid credentials"});

			jwt.sign(
				{id: user._id},
				process.env.jwtSecret,
				{expiresIn: 3600},
				(err, token) => {
					if (err) throw err;
					res.json({
						token,
						user: {
							id: user._id,
							username: user.username,
							email: user.email
						}
					});
				}
			);
		});
	});
});

router.get("/user", auth, (req, res) => {
	Users.findById(req.user.id)
		.select("-password")
		.then((user) => res.json(user))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
