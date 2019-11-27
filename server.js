const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const marketRoute = require("./routes/marketplace");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.use("/marketplace/", marketRoute);

app.listen(port, () => {
	console.log(`Server started on port: ${port}`);
});
