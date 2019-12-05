const router = require("express").Router();
let Feed = require("../models/feed.model");
let Users = require("../models/users.model");

const auth = require("../middleware/auth.middleware");

// work-around to wait for asyc function.. hope no possible-employer ever see this

const awaitArray = (postArray, posts, res) => {
	if (postArray.length === posts.length) {
		setTimeout(() => res.json(postArray), 50);
	} else {
		setTimeout(() => awaitArray(postArray, posts, res), 50);
	}
};

router.get("/", async (req, res) => {
	await Feed.find({}, (err, posts) => {
		if (err) throw err;
		if (posts) {
			let postArray = [];
			posts.forEach(async (post) => {
				await Users.findOne({email: post.email}, (err, user) => {
					if (err) throw err;
					if (user) {
						postArray.push({
							post,
							user: {
								username: user.username,
								email: user.email,
								profilePicture: user.profilePicture,
								id: user._id
							}
						});
					} else {
						postArray.push({
							post: {
								msg: "removed"
							},
							user: {
								username: "removed",
								email: "removed@web.com",
								profilePicture: "",
								id: "xxx"
							}
						});
					}
				});
			});
			awaitArray(postArray, posts, res);
		}
	});
});

router.post("/add", auth, (req, res) => {
	const email = req.body.email;
	const msg = req.body.msg;

	const newPost = new Feed({
		email,
		msg
	});

	newPost
		.save()
		.then(() => res.json("Submission saved"))
		.catch((err) => res.status(400).json(err));
});

router.delete("/delete/:id", auth, (req, res) => {
	Feed.findByIdAndDelete(req.params.id)
		.then(() => res.json(`item deleted`))
		.catch((err) => res.status(400).json(err));
});

router.post("/update/:id", auth, (req, res) => {
	Feed.findById(req.params.id)
		.then((item) => {
			item.username = req.body.username;
			item.email = req.body.email;
			item.msg = req.body.msg;

			item
				.save()
				.then(() => res.json(`item updated.`))
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => res.status(400).json(err));
});

module.exports = router;
