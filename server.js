const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const sslRedirect = require("heroku-ssl-redirect");

const marketRoute = require("./routes/marketplace");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const subRoute = require("./routes/submissions");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(sslRedirect());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once("open", () =>
	console.log("Database connection established successfully.")
);

app.use("/api/items", marketRoute);
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/submissions", subRoute);

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

app.listen(port, () => {
	console.log(`Server started on port: ${port}`);
});
