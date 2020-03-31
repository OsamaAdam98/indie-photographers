import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: "feed",
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  customID: {
    type: String,
    unique: true
  }
});

export interface Like extends mongoose.Document {
  user: string;
  post: string;
  date: Date;
  customID: string;
}

export default mongoose.model<Like>("likes", likeSchema);
