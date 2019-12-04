const router = require("express").Router();
let Submissions = require("../models/submissions.model");
let Users = require("../models/users.model");

const auth = require("../middleware/auth.middleware");

// work-around to wait for asyc function.. hope no possible-employer ever see this

const awaitArray = (subArray, submissions, res) => {
	if (subArray.length === submissions.length) {
		setTimeout(() => res.json(subArray), 50);
	} else {
		setTimeout(() => awaitArray(subArray, submissions, res), 50);
	}
};

router.get("/", async (req, res) => {
	await Submissions.find({}, (err, submissions) => {
		if (err) throw err;
		if (submissions) {
			let subArray = [];
			submissions.forEach(async (submission) => {
				await Users.findOne({email: submission.email}, (err, user) => {
					if (err) throw err;
					if (user) {
						subArray.push({
							submission,
							user: {
								username: user.username,
								email: user.email,
								profilePicture: user.profilePicture
							}
						});
					}
				});
			});
			awaitArray(subArray, submissions, res);
		}
	});
});

router.post("/add", auth, (req, res) => {
	const email = req.body.email;
	const msg = req.body.msg;

	const newSubmission = new Submissions({
		email,
		msg
	});

	newSubmission
		.save()
		.then(() => res.json("Submission saved"))
		.catch((err) => res.status(400).json(err));
});

router.delete("/delete/:id", auth, (req, res) => {
	Submissions.findByIdAndDelete(req.params.id)
		.then(() => res.json(`item deleted`))
		.catch((err) => res.status(400).json(err));
});

router.post("/update/:id", auth, (req, res) => {
	Submissions.findById(req.params.id)
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
