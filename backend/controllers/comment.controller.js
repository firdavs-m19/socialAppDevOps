import Comment from "../models/Comment.js"; // adjust path as needed

export const getComments = async (req, res) => {
  try {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const comments = await Comment.find({ postId })
      .populate("userId", "name profilePic") // Populate user's name and profile picture
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to get comments." });
  }
};

export const createComment = async (req, res) => {
  try {
    const { desc, postId } = req.body;
    const userId = req.userId; // Assuming you're using middleware to set req.userId

    // Validation
    if (!desc || !postId || !userId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newComment = new Comment({
      desc,
      userId,
      postId,
    });

    const savedComment = await newComment.save();

    // Optionally populate the saved comment before sending back
    const populatedComment = await savedComment.populate(
      "userId",
      "name profilePic"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Failed to create comment." });
  }
};
