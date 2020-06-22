import User from "../../models/users.model";
import Like from "../../models/likes.model";
import Comment from "../../models/comments.model";

const Feed = {
  user: async ({ user }: { user: string }) =>
    await User.findById(user).select("-password").exec(),

  likes: async ({ likes }: { likes: string[] }) =>
    Like.find().where("_id").in(likes).exec(),

  comments: async ({ comments }: { comments: string[] }) =>
    Comment.find().where("_id").in(comments).exec(),
};

export default Feed;
