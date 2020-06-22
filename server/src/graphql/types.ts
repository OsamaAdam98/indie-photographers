import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String!
    profilePicture: String
    registerDate: Date!
    admin: Boolean!
  }

  type UserWithToken {
    user: User!
    token: String!
  }

  type FeedWithStatus {
    post: Feed!
    postStatus: String!
  }

  type Feed {
    _id: ID!
    user: User!
    msg: String
    photo: String
    likes: [Like]
    comments: [Comment]
    date: Date!
  }

  type Comment {
    _id: ID!
    user: User!
    msg: String
    photo: String
    likes: [Like]
    post: Feed
    date: Date!
  }

  type Like {
    _id: ID!
    user: User!
    post: Feed!
    date: Date!
    customID: String!
  }

  type Query {
    user(id: ID, email: String): User
    feedById(id: ID!): Feed
    feedByUserId(id: ID!, page: Int): [Feed]
    feedByEmail(email: String!, page: Int): [Feed]
    feedByPage(page: Int): [Feed]
    login(email: String!, password: String!): UserWithToken
  }

  type Mutation {
    post(msg: String, photo: String): Feed
    deletePost(id: ID!): FeedWithStatus!
  }
`;

export default typeDefs;
