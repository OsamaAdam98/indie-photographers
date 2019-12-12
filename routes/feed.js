const router = require("express").Router();
let Feed = require("../models/feed.model");
let Comment = require("../models/comments.model");
let Likes = require("../models/likes.model");

const auth = require("../middleware/auth.middleware");

router.get("/", (req, res) => {
	const {page} = req.query;

	Feed.find()
		.sort({date: -1})
		.limit(10)
		.skip(page >= 1 ? 10 * (page - 1) : 0)
		.populate("user comments likes", "-password -registerDate -__v -posts")
		.exec()
		.then((result) => res.status(200).json(result))
		.catch((err) => res.status(500).json(err));
});

router.post("/add", auth, (req, res) => {
	const msg = req.body.msg;
	const photo = req.body.photo;
	const user = req.user.id;

	const newPost = new Feed({
		msg,
		photo,
		user
	});

	newPost
		.save()
		.then(() => res.json("Submission saved"))
		.catch((err) => res.status(400).json(err));
});

router.post("/comment/:id", auth, (req, res) => {
	const msg = req.body.msg;
	const photo = req.body.photo;
	const user = req.user.id;
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
				{$push: {comments: newComment._id}},
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
	const user = req.user.id;

	const like = new Likes({
		user,
		post: id
	});

	like
		.save()
		.then(() => {
			// Todo: make the like change state when called
			Feed.findByIdAndUpdate(post, {$set: {likes: !likes}}, (err) => {
				if (err) throw err;
			});
		})
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
			item.email = req.body.email;
			item.msg = req.body.msg;
			item.photo = req.body.photo;

			item
				.save()
				.then(() => res.json(`item updated.`))
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => res.status(400).json(err));
});

module.exports = router;
