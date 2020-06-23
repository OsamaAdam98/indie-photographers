import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import Comment from "./queries/comment";
import Feed from "./queries/feed";
import Like from "./queries/like";
import { deletePost, post, like } from "./resolvers/mutations";
import {
  feedByEmail,
  feedById,
  feedByPage,
  feedByUserId,
  login,
  user,
} from "./resolvers/queries";

const resolvers = {
  Query: {
    user,
    feedById,
    feedByEmail,
    feedByPage,
    feedByUserId,
    login,
  },
  Mutation: {
    post,
    deletePost,
    like,
  },
  Feed,
  Like,
  Comment,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(+ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};

export default resolvers;
