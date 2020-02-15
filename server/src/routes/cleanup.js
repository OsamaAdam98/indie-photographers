const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
let Feed = require("../models/feed.model");
let Likes = require("../models/likes.model");
let Comments = require("../models/comments.model");
let Users = require("../models/users.model");

router.get("/user/:id", auth, (req, res) => {
	const id = req.params.id;
	Users.findById(req.user.id)
		.exec()
		.then((user) => {
			if (user.admin) {
				Feed.deleteMany({user: id})
					.exec()
					.then(() => {
						console.log("Deleted posts");
						Likes.deleteMany({user: id})
							.exec()
							.then(() => {
								console.log("Deleted likes");
								Comments.deleteMany({user: id})
									.exec()
									.then(() => {
										console.log("Deleted comments");
										Users.findByIdAndDelete(id)
											.exec()
											.then(() => {
												console.log("Deleted user");
												res.status(200).json("deleted");
											})
											.catch((err) => console.log(err));
									})
									.catch((err) => console.log(err));
							})
							.catch((err) => console.log(err));
					})
					.catch((err) => console.log(err));
			} else {
				res.status(401).json("Unauthorized");
			}
		})
		.catch((err) => console.log(err));
});

module.exports = router;
