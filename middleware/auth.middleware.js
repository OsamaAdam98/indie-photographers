const jwt = require("jsonwebtoken");

function auth(req, res, next) {
	const token = req.header("x-auth-token");

	if (!token) return res.status(401).json({msg: "Authorization denied."});

	try {
		const decrypted = jwt.verify(token, process.env.jwtSecret);
		req.user = decrypted;
		next();
	} catch (e) {
		res.status(401).json({msg: "Not a valid token"});
	}
}

module.exports = auth;
