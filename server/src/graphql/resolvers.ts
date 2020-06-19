import { feedByEmail, feedById, feedByPage, user } from "./resolvers/queries";

const resolvers = {
  Query: {
    user,
    feedById,
    feedByEmail,
    feedByPage,
  },
};

export default resolvers;
