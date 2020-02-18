import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.middleware";
import {Router} from "express";
const router = Router();

import Users from "../models/users.model";

// sign in and token generation

router.post("/", (req, res) => {
	const email: string = req.body.email.toLowerCase();
	const password: string = req.body.password;
	if (!email || !password) {
		return res.status(400).json({msg: "Please enter all fields"});
	}
	Users.findOne({email}).then((user) => {
		if (!user) return res.status(404).json({msg: "User doesn't exist."});
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch) return res.status(400).json({msg: "Invalid credentials"});

			jwt.sign({id: user._id, admin: user.admin}, process.env.jwtSecret, (err: jwt.VerifyErrors, token: string) => {
				if (err) throw err;
				res.json({
					token,
					user: {
						_id: user._id,
						username: user.username,
						email: user.email,
						profilePicture: user.profilePicture,
						admin: user.admin
					}
				});
			});
		});
	});
});

router.post("/facebook-login", (req, res) => {
	if (req.body.status !== "unknown") {
		console.log(req.body);
		const {email, name} = req.body;
		const {url} = req.body.picture.data;

		Users.findOne({email})
			.then((user) => {
				if (user) {
					jwt.sign(
						{id: user._id, admin: user.admin},
						process.env.jwtSecret,
						(err: jwt.JsonWebTokenError, token: string) => {
							if (err) throw err;
							res.json({
								token,
								user: {
									id: user._id,
									username: user.username,
									email: user.email,
									profilePicture: user.profilePicture,
									admin: user.admin
								}
							});
						}
					);
					Users.updateOne({email}, {$set: {profilePicture: url}}, (err) => {
						if (err) throw err;
					});
				} else {
					const newUser = new Users({
						username: name,
						email: email,
						password: req.body.accessToken,
						profilePicture: url
					});

					bcrypt.genSalt(10, (err, salt) => {
						if (err) throw err;
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;
							newUser.password = hash;
							newUser
								.save()
								.then((user) => {
									jwt.sign(
										{id: user._id, admin: user.admin},
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
													admin: user.admin,
													profilePicture: user.profilePicture
												}
											});
										}
									);
								})
								.catch((err) => res.status(400).json(err));
						});
					});
				}
			})
			.catch(() => res.status(400).json("Sign in failed!"));
	}
});

router.post("/google-login", (req, res) => {
	const {email, name} = req.body.profileObj;
	const imageUrl = req.body.profileObj.imageUrl.replace("s96-c", "s384-c", true);

	Users.findOne({email}).then((user) => {
		if (user) {
			jwt.sign(
				{id: user._id, admin: user.admin},
				process.env.jwtSecret,
				(err: jwt.JsonWebTokenError, token: string) => {
					if (err) throw err;
					res.json({
						token,
						user: {
							id: user._id,
							username: user.username,
							email: user.email,
							profilePicture: user.profilePicture,
							admin: user.admin
						}
					});
				}
			);
		} else {
			const newUser = new Users({
				username: name,
				email: email,
				password: req.body.tokenObj.access_token,
				profilePicture: imageUrl
			});

			bcrypt.genSalt(10, (err, salt) => {
				if (err) throw err;
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then((user) => {
							jwt.sign({id: user._id, admin: user.admin}, process.env.jwtSecret, {expiresIn: 3600}, (err, token) => {
								if (err) throw err;
								res.json({
									token,
									user: {
										id: user._id,
										username: user.username,
										email: user.email,
										admin: user.admin,
										profilePicture: user.profilePicture
									}
								});
							});
						})
						.catch((err) => res.status(400).json(err));
				});
			});
		}
	});
});

// user data

router.get("/user", auth, (req, res) => {
	Users.findById(req.body.user.id)
		.select("-password")
		.then((user) => res.json(user))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

export default router;
