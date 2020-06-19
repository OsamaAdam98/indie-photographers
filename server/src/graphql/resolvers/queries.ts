import User from "../../models/users.model";
import Feed from "../../models/feed.model";

export const user = async (
  parent: any,
  args: { id?: string; email?: string },
  context: any
) => {
  if (args.id) {
    return await User.findById(args.id).exec();
  } else if (args.email) {
    return await User.findOne({ email: args.email }).exec();
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

export const feedByEmail = async (parent: any, args: { email: string }) => {
  const user = await User.findOne({ email: args.email }).exec();
  if (user) {
    return await Feed.find({ user: user._id })
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
