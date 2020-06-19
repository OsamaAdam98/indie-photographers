import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    profilePicture: String
    registerDate: String!
    admin: Boolean!
  }

  type Feed {
    _id: ID!
    user: User!
    msg: String
    photo: String
    likes: [Like]
    comments: [Comment]
    date: String!
  }

  type Comment {
    _id: ID!
    user: User!
    msg: String
    photo: String
    likes: [Like]
    post: Feed
    date: String!
  }

  type Like {
    _id: ID!
    user: User!
    post: Feed!
    date: String!
    customID: String!
  }

  type Query {
    user(id: ID, email: String): User
    feedById(id: ID!): Feed
    feedByEmail(email: String!): [Feed]
    feedByPage(page: Int!): [Feed]
  }
`;

export default typeDefs;
