import Post from "../models/Post.js"; // Assuming the Post model is located here

// In your post.controller.js
export const getPosts = async (req, res) => {
  try {
    const { userId } = req.query;

    let posts = [];

    if (userId) {
      // Validate userId
      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid userId format." });
      }

      // Get user's posts first
      const userPosts = await Post.find({ userId })
        .populate("userId", "username email name profilePic") // Add "name" to the populated fields
        .sort({ createdAt: -1 });

      // Get other users' posts
      const otherPosts = await Post.find({ userId: { $ne: userId } })
        .populate("userId", "username email name profilePic") // Add "name" to the populated fields
        .sort({ createdAt: -1 });

      // Combine the user's posts and other posts
      posts = [...userPosts, ...otherPosts];
    } else {
      // If no userId is provided, return all posts
      posts = await Post.find()
        .populate("userId", "username email")
        .sort({ createdAt: -1 });
    }

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found." });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const createPost = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User is not authenticated." });
    }

    // Validate the description field
    if (!req.body.desc) {
      return res.status(400).json({ message: "Post description is required." });
    }

    // Validate and handle the img field properly (if present)
    const img = req.body.img ? req.body.img : ""; // Ensure img is a string, or an empty string if not provided

    // Create a new post object
    const newPost = new Post({
      desc: req.body.desc, // Post description
      img: img, // Image URL as a string
      userId: req.user.userId, // User ID from decoded token
    });

    // Save the new post to the database
    const savedPost = await newPost.save();

    // Respond with the saved post
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
