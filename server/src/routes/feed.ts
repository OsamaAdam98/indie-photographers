import moment from "moment";
import fs from "fs";
import auth from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
import { Router } from "express";

import Feed from "../models/feed.model";
import Comment from "../models/comments.model";
import Likes from "../models/likes.model";
import Users from "../models/users.model";

const router = Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUDINAY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", (req, res) => {
	const { page } = req.query;

	Feed.find()
		.sort({ date: "desc" })
		.limit(10)
		.skip(page >= 1 ? 10 * (page - 1) : 0)
		.select("-photoId")
		.populate(
			"user comments likes",
			"-password -registerDate -__v -posts -email"
		)
		.populate({
			path: "likes",
			populate: {
				path: "user",
				model: "users"
			}
		})
		.exec()
		.then((result) => res.status(200).json(result))
		.catch((err) => res.status(500).json(err));
});

router.post("/add", [upload.single("image"), auth], (req: any, res: any) => {
	const user = req.body.user.id;
	const admin = req.body.user.admin;
	const { msg } = JSON.parse(req.body.data);
	const filePath = req.file ? req.file.path : null;

	Feed.findOne({ user })
		.sort({ date: "desc" })
		.skip(1)
		.exec()
		.then((result) => {
			let date: Date;
			if (result) date = new Date(result.date);

			if (date ? moment().diff(date, "minutes") > 15 : true || admin) {
				if (filePath) {
					cloudinary.uploader.unsigned_upload(
						filePath,
						"hahlpxqe",
						{ cloud_name: process.env.CLOUD_NAME },
						(err: Error, result: any) => {
							if (err) {
								res.status(500).json("upload failed!");
							} else {
								const photo = result;
								fs.unlinkSync(req.file.path);

								const newPost = new Feed({
									msg,
									photo,
									user
								});

								newPost
									.save()
									.then(() => {
										Feed.findById(newPost._id)
											.populate(
												"user comments likes",
												"-password -registerDate -__v -posts"
											)
											.exec()
											.then((result) => res.status(201).json(result))
											.catch((err) => res.status(404).json(err));
									})
									.catch((err) => {
										res.status(400).json(err);
										console.log(err);
									});
							}
						}
					);
				} else {
					const newPost = new Feed({
						msg,
						user
					});

					newPost
						.save()
						.then(() => {
							Feed.findById(newPost._id)
								.populate(
									"user comments likes",
									"-password -registerDate -__v -posts"
								)
								.exec()
								.then((result) => res.status(201).json(result))
								.catch((err) => res.status(404).json(err));
						})
						.catch((err) => {
							res.status(400).json(err);
							console.log(err);
						});
				}
			} else {
				res
					.status(403)
					.json("Can't post more than 2 posts in a 15 minutes span!");
			}
		})
		.catch((err) => console.log(err));
});

router.post("/upload", upload.single("image"), (req, res) => {
	cloudinary.uploader.unsigned_upload(
		req.file.path,
		"hahlpxqe",
		{ cloud_name: process.env.CLOUD_NAME },
		(err: Error, result: any) => {
			if (err) {
				res.status(500).json("upload failed!");
			} else {
				res.status(200).json(result);
				fs.unlinkSync(req.file.path);
			}
		}
	);
});

router.post("/comment/:id", auth, (req, res) => {
	const msg = req.body.msg;
	const photo = req.body.photo;
	const user = req.body.user.id;
	const post = req.params.id;

	const newComment = new Comment({
		msg,
		photo,
		user,
		post
	});

	newComment
		.save()
		.then(() => {
			Feed.findByIdAndUpdate(
				post,
				{ $push: { comments: newComment._id } },
				(err) => {
					if (err) throw err;
				}
			);
			res.status(200).json("Comment submitted");
		})
		.catch((err) => res.status(500).json(err));
});

router.post("/like/:id", auth, (req, res) => {
	const id = req.params.id;
	const user = req.body.user.id;
	const customID = `${user}${id}`;

	const like = new Likes({
		user,
		post: id,
		customID
	});

	like
		.save()
		.then(() => {
			Feed.findById(id)
				.exec()
				.then((post) => {
					const postLike = post.likes.filter((likeIterator) => {
						likeIterator === like._id;
					});
					if (postLike.length === 0) {
						Feed.findByIdAndUpdate(
							post._id,
							{ $push: { likes: like._id } },
							(err) => {
								if (err) throw err;
								res.status(200).json({ like: true });
							}
						);
					}
				})
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => {
			if (err) {
				Likes.find({ customID })
					.exec()
					.then((like) => {
						Feed.findById(like[0].post)
							.exec()
							.then((post) => {
								Feed.findByIdAndUpdate(
									post._id,
									{ $pull: { likes: like[0]._id } },
									{ upsert: true },
									(err) => {
										if (err) throw err;
										Likes.findByIdAndDelete(like[0]._id)
											.exec()
											.then(() => res.status(200).json({ like: false }))
											.catch(() => res.status(404).json("like not found"));
									}
								);
							});
					})
					.catch((err) => res.status(400).json(err));
			}
		});
});

router.get("/likes/:postID", (req, res) => {
	const postID = req.params.postID;
	Likes.find({ post: postID })
		.populate("user", "-password")
		.sort({ date: "asc" })
		.exec()
		.then((likes) => {
			res.status(200).json(likes);
		})
		.catch(() => res.status(404).json("Post not found"));
});

router.delete("/delete/:id", auth, (req, res) => {
	Feed.findById(req.params.id)
		.exec()
		.then((post) => {
			if (post.photo) {
				cloudinary.api.delete_resources(
					[`${post.photo.public_id}`],
					{
						cloud_name: process.env.CLOUD_NAME,
						api_key: process.env.CLOUDINAY_API_KEY,
						api_secret: process.env.CLOUDINARY_API_SECRET
					},
					(err: Error, result: any) => {
						if (err) throw err;
						else {
							Feed.findByIdAndDelete(req.params.id)
								.then(() => {
									res.status(200).json(`Post deleted!`);
								})
								.catch(() =>
									res.status(404).json("Post not found with picture")
								);
						}
					}
				);
			} else {
				Feed.findByIdAndDelete(post._id)
					.then(() => {
						res.status(200).json(`Post deleted!`);
					})
					.catch(() => res.status(404).json("Post not found without picture"));
			}
		})
		.catch(() => res.status(404).json("Post not found global"));
});

// router.delete("/delete-photo/:photoId", (req, res) => {
// 	cloudinary.api.delete_resources(
// 		[`${req.params.photoId}`],
// 		{
// 			cloud_name: process.env.CLOUD_NAME,
// 			api_key: process.env.CLOUDINAY_API_KEY,
// 			api_secret: process.env.CLOUDINARY_API_SECRET
// 		},
// 		(err, result) => {
// 			if (err) console.log(err);
// 			res.status(200).json("Photo deleted");
// 		}
// 	);
// });

// router.post("/update/:id", auth, (req, res) => {
// 	Feed.findById(req.params.id)
// 		.then((item) => {
// 			item.email = req.body.email;
// 			item.msg = req.body.msg;
// 			item.photo = req.body.photo;

// 			item
// 				.save()
// 				.then(() => res.json(`item updated.`))
// 				.catch((err) => res.status(400).json(err));
// 		})
// 		.catch((err) => res.status(400).json(err));
// });

router.get("/user/:id/", (req, res) => {
	const { page }: { page: number } = req.query;

	Feed.find({ user: req.params.id })
		.sort({ date: "desc" })
		.limit(10)
		.skip(page >= 1 ? 10 * (page - 1) : 0)
		.populate(
			"user comments likes",
			"-password -registerDate -__v -posts -email"
		)
		.populate({
			path: "likes",
			populate: {
				path: "user",
				model: "users"
			}
		})
		.exec()
		.then((result) => res.status(200).json(result))
		.catch((err) => res.status(404).json(err));
});

export default router;
