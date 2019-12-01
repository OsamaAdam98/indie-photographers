const router = require("express").Router();
let Submissions = require("../models/submissions.model");

const auth = require("../middleware/auth.middleware");

router.get("/", (req, res) => {
	Submissions.find()
		.then((submissions) => res.json(submissions))
		.catch((err) => res.status(400).json(err));
});

router.post("/add", auth, (req, res) => {
	const username = req.body.username;
	const email = req.body.email;
	const msg = req.body.msg;

	const newSubmission = new Submissions({
		username,
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
		.catch((err) => res.status(400).json(`Error: ${err}`));
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
				.catch((err) => res.status(400).json(`Error: ${err}`));
		})
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
