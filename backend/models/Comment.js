import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // References the Post model
      required: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
