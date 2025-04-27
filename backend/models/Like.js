import mongoose from "mongoose";

// Define the schema for a Like
const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the Post model
      required: true,
    },
  },
  { timestamps: true } // Automatically create createdAt and updatedAt fields
);

// Create the Like model based on the schema
const Like = mongoose.model("Like", likeSchema);

export default Like;
