import Like from "../models/Like.js"; // Import the Like model

// Function to get all likes (or filter them as needed)
export const getLikes = async (req, res) => {
  try {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const likes = await Like.find({ postId });
    const userIds = likes.map((like) => like.userId); // send only user IDs to frontend

    res.status(200).json(userIds); // frontend expects array of userIds
  } catch (error) {
    console.error("Error getting likes:", error);
    res.status(500).json({ message: "Failed to get likes." });
  }
};

// Function to like a post
export const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userId; // Get userId from the decoded token

    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "Post ID and User ID are required." });
    }

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ userId, postId });

    if (existingLike) {
      return res.status(400).json({ message: "You already liked this post." });
    }

    // Create a new like entry
    const newLike = new Like({ userId, postId });
    const savedLike = await newLike.save();

    res.status(201).json(savedLike); // Return the saved like object
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Failed to like the post." });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { postId } = req.query;
    const userId = req.userId; // from your auth middleware

    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "Post ID and User ID are required." });
    }

    const deleted = await Like.findOneAndDelete({ userId, postId });

    if (!deleted) {
      return res.status(404).json({ message: "Like not found." });
    }

    res.status(200).json({ message: "Like removed." });
  } catch (error) {
    console.error("Error deleting like:", error);
    res.status(500).json({ message: "Failed to delete like." });
  }
};
