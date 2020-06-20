import User from "../../models/users.model";
import Feed from "../../models/feed.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticationError, ApolloError } from "apollo-server-express";

export const login = async (
  parent: any,
  args: { email: string; password: string }
) => {
  const email = args.email.toLowerCase();
  try {
    const user = await User.findOne({ email }).exec();

    if (!user) throw new ApolloError("User not found", "404");
    const isMatch = await bcrypt.compare(args.password, user.password);
    if (!isMatch) throw new AuthenticationError("Invalid credentials!");
    const token = jwt.sign(
      { _id: user._id, admin: user.admin },
      process.env.jwtSecret
    );
    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        profilePicture: user.profilePicture,
        registerDate: user.registerDate,
        username: user.username,
        admin: user.admin,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const user = async (
  parent: any,
  args: { id?: string; email?: string },
  context: any
) => {
  if (args.id) {
    return await User.findById(args.id).select("-password").exec();
  } else if (args.email) {
    return await User.findOne({ email: args.email }).select("-password").exec();
  }
};

export const feedById = async (parent: any, args: { id: string }) => {
  return await Feed.findById(args.id)
    .populate(
      "user comments likes",
      "-password -registerDate -__v -posts -email"
    )
    .populate({
      path: "likes",
      populate: {
        path: "user",
        model: "users",
      },
    })
    .exec();
};

export const feedByUserId = async (
  parent: any,
  args: { id: string; page: number }
) => {
  const page = args.page;
  return await Feed.find({ user: args.id })
    .sort({ date: "desc" })
    .limit(10)
    .skip(page >= 1 ? 10 * (page - 1) : 0)
    .select("-photoId")
    .populate(
      "user comments likes",
      "-password -registerDate -__v -posts -email"
    )
    .populate({
      path: "likes",
      populate: {
        path: "user",
        model: "users",
      },
    })
    .exec();
};

export const feedByEmail = async (
  parent: any,
  args: { email: string; page: number }
) => {
  const { page, email } = args;
  const user = await User.findOne({ email }).exec();
  if (user) {
    return await Feed.find({ user: user._id })
      .sort({ date: "desc" })
      .limit(10)
      .skip(page >= 1 ? 10 * (page - 1) : 0)
      .select("-photoId")
      .populate(
        "user comments likes",
        "-password -registerDate -__v -posts -email"
      )
      .populate({
        path: "likes",
        populate: {
          path: "user",
          model: "users",
        },
      })
      .exec();
  }
};

export const feedByPage = async (parent: any, args: { page?: number }) => {
  const page = Number(args.page);
  return await Feed.find()
    .sort({ date: "desc" })
    .limit(10)
    .skip(page >= 1 ? 10 * (page - 1) : 0)
    .select("-photoId")
    .populate(
      "user comments likes",
      "-password -registerDate -__v -posts -email"
    )
    .populate({
      path: "likes",
      populate: {
        path: "user",
        model: "users",
      },
    })
    .exec();
};
