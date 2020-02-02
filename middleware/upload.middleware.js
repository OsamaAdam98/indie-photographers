const multer = require("multer");

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb({error: "file type not supported"}, false);
	}
};

const upload = multer({
	dest: "uploads/",
	limits: {
		fileSize: 1024 * 1024 * 8
	},
	fileFilter: fileFilter
});

module.exports = upload;
