import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/types";
import sslRedirect from "./middleware/sslRedirect.middleware";
import authRoute from "./routes/auth";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const GraphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.header("authentication");

    if (!token)
      return {
        auth: "UNAUTHENTICATED",
      };
    else {
      try {
        return {
          auth: jwt.verify(token, process.env.JWT_SECRET),
        };
      } catch (e) {
        return {
          auth: "UNAUTHENTICATED",
        };
      }
    }
  },
});

app.use(cors());
app.use(express.json());
app.use(sslRedirect(["production"]));
GraphqlServer.applyMiddleware({ app });

app.use("/api/auth", authRoute);

if (process.env.NODE_ENV === "production") {
  try {
    const uri = process.env.ATLAS_URI || process.env.MONGO_URI;

    if (uri) {
      mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
    }
  } catch (error) {
    console.error(error);
  }

  app.use(express.static(path.resolve(__dirname, "..", "..", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"));
  });
} else {
  try {
    const uri = process.env.MONGO_URI;

    if (uri) {
      mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

mongoose.connection.once("open", () =>
  console.log("Database connection established successfully.")
);

mongoose.connection.on("error", (error) => console.error(error));

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
