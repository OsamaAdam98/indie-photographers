import mongoose from "mongoose";
import Like from "./likes.model";

const feedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  msg: {
    type: String,
    required: false,
  },
  photo: {
    type: String,
    required: false,
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "likes",
    },
  ],
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "comments",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

feedSchema.post("remove", async function (doc: PostType) {
  await Like.remove({ _id: { $in: doc.likes } });
});

export interface PostType extends mongoose.Document {
  user: string;
  msg: string;
  photo: string;
  likes: string[];
  comments: string[];
  date: Date;
}

export default mongoose.model<PostType>("feed", feedSchema);
