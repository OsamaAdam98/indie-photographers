import Feed from "../../models/feed.model";
import User from "../../models/users.model";
import Like from "../../models/likes.model";

const Comment = {
  post: async ({ post }: { post: string }) => await Feed.findById(post).exec(),

  user: async ({ user }: { user: string }) =>
    await User.findById(user).select("-password").exec(),

  likes: async ({ likes }: { likes: string[] }) =>
    await Like.find({ _id: { $in: [...likes] } }).exec(),
};

export default Comment;
