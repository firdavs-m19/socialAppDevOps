import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true, // Image URL or path for the story
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Story = mongoose.model("Story", storySchema);

export default Story;
