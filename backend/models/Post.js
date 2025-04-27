import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      default: "", // image URL or path
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 👈 This references the User model
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
