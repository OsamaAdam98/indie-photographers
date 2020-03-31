import mongoose from "mongoose";

const userSchema: mongoose.Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  profilePicture: {
    type: String,
    required: false,
    default:
      "https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-7.png"
  },
  password: {
    type: String,
    required: true
  },
  registerDate: {
    type: Date,
    default: Date.now
  },
  admin: {
    type: Boolean,
    default: false
  },
  details: mongoose.Schema.Types.Mixed
});

export interface User extends mongoose.Document {
  username: string;
  email: string;
  profilePicture: string | Photo;
  password: string;
  registerDate: Date;
  admin: boolean;
}

export default mongoose.model<User>("users", userSchema);
