import multer from "multer";

const upload = multer({
	dest: "uploads/",
	limits: {
		fileSize: 1024 * 1024 * 8
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
			cb(null, true);
		} else {
			cb({ name: "error", message: "file type not supported" });
		}
	}
});

export default upload;
