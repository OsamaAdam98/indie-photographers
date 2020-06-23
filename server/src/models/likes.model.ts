import mongoose from "mongoose";
import Feed from "./feed.model";

export interface LikeType extends mongoose.Document {
  user: string;
  post: string;
  date: Date;
}

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: "feed",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

likeSchema.pre<LikeType>("remove", async function () {
  await Feed.findOneAndUpdate(
    { _id: this.post },
    {
      $pull: { likes: this._id },
    }
  ).exec();
});

likeSchema.post<LikeType>("save", async function () {
  await Feed.findOneAndUpdate(
    { _id: this.post },
    {
      $push: { likes: this._id },
    }
  ).exec();
});

export default mongoose.model<LikeType>("likes", likeSchema);
