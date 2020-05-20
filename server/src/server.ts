import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import sslRedirect from "./middleware/sslRedirect.middleware";
import authRoute from "./routes/auth";
import cleanupRoute from "./routes/cleanup";
import feedRoute from "./routes/feed";
import usersRoute from "./routes/users";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(
  sslRedirect([process.env.ISHEROKU === "true" ? "production" : "development"])
);

const uri = process.env.ATLAS_URI;

if (uri) {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
}

const connection = mongoose.connection;

connection.once("open", () =>
  console.log("Database connection established successfully.")
);

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/feed", feedRoute);
app.use("/api/cleanup", cleanupRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
