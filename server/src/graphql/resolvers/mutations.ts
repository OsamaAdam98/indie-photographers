import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import moment from "moment";
import Feed from "../../models/feed.model";

interface Auth {
  id: string;
  admin: boolean;
  iat: Date;
}

export const post = async (
  parent: any,
  args: { msg?: string; photo?: string },
  context: { auth: Auth | "UNAUTHENTICATED" }
) => {
  if (context.auth === "UNAUTHENTICATED")
    throw new AuthenticationError("User unauthenticated!");

  const user = context.auth.id;
  const admin = context.auth.admin;
  const { msg, photo } = args;

  try {
    const result = await Feed.findOne({ user })
      .sort({ date: "desc" })
      .skip(1)
      .exec();
    let date: Date;
    if (result) date = new Date(result.date);

    if ((date ? moment().diff(date, "minutes") > 15 : true) || admin) {
      const newPost = new Feed({
        msg,
        photo,
        user,
      });

      const saveResult = await newPost.save();
      return await saveResult.populate("user").execPopulate();
    } else {
      throw new ForbiddenError(
        "Can't post more than 2 posts in a 15 minutes span!"
      );
    }
  } catch (error) {
    throw error;
  }
};
