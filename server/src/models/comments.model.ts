import mongoose from "mongoose";

const commentSchema: mongoose.Schema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true
  },
  msg: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "likes"
    }
  ],
  post: {
    type: mongoose.Types.ObjectId,
    ref: "feed",
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export interface Comment extends mongoose.Document {
  user: string;
  msg: string;
  photo: Photo | string;
  likes: string[];
  post: string;
  date: Date;
}

export default mongoose.model<Comment>("comments", commentSchema);
