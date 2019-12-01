const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
let Users = require("../models/users.model");

// User registeration

router.post("/", (req, res) => {
	const {username, email, password, admin} = req.body;
	if (!username || !email || !password) {
		return res.status(400).json({msg: "Please enter all fields"});
	}
	Users.findOne({email}).then((user) => {
		if (user) return res.status(400).json({msg: "User already exists."});

		const newUser = new Users({
			username,
			email,
			password,
			admin
		});

		newUser.email = email.toLowerCase();

		bcrypt.genSalt(10, (err, salt) => {
			if (err) throw err;
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
				newUser
					.save()
					.then((user) => {
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
										email: user.email,
										admin: user.admin
									}
								});
							}
						);
					})
					.catch((err) => res.status(400).json(`Error: ${err}`));
			});
		});
	});
});

module.exports = router;
