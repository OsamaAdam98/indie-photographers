const router = require("express").Router();
let Market = require("../models/marketplace.model");

router.get("/", (req, res) => {
	Market.find()
		.then((items) => res.json(items))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/add", (req, res) => {
	const img = req.body.img;
	const title = req.body.title;
	const name = req.body.name;
	const desc = req.body.desc;

	const newItem = new Market({
		img,
		title,
		name,
		desc
	});

	newItem
		.save()
		.then(() => res.json("item saved"))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/:id", (req, res) => {
	Market.findByIdAndDelete(req.params.id)
		.then(() => res.json(`item deleted`))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/update/:id", (req, res) => {
	Market.findById(req.params.id)
		.then((item) => {
			item.img = req.body.img;
			item.title = req.body.title;
			item.name = req.body.name;
			item.desc = req.body.desc;

			item
				.save()
				.then(() => res.json(`item updated.`))
				.catch((err) => res.status(400).json(`Error: ${err}`));
		})
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
