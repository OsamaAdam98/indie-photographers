import User from "../../models/users.model";
import Feed from "../../models/feed.model";

const Like = {
  user: async ({ user }: { user: string }) =>
    await User.findById(user).select("-password").exec(),

  post: async ({ post }: { post: string }) => await Feed.findById(post).exec(),
};

export default Like;
