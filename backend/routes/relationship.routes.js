import express from "express";
import User from "../models/User.js";
import mongoose from "mongoose"; // Import mongoose to use ObjectId validation
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

// Follow User
router.post("/", checkAuth, async (req, res) => {
  const { followedUserId } = req.body;
  const followerUserId = req.userId; // The user from the authentication middleware

  // Log the incoming followedUserId and the authenticated userId
  console.log("Authenticated User ID:", followerUserId);
  console.log("Followed User ID:", followedUserId);

  if (!followerUserId) return res.status(400).json("User not authenticated");

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(followedUserId)) {
    return res.status(400).json("Invalid followed user ID format");
  }

  if (followedUserId === followerUserId) {
    return res.status(400).json("You can't follow yourself");
  }

  try {
    // Find followed user
    const followedUser = await User.findById(followedUserId);
    if (!followedUser) return res.status(404).json("Followed user not found");

    // Find follower user
    const followerUser = await User.findById(followerUserId);
    if (!followerUser) return res.status(404).json("Follower not found");

    // Check if already following
    if (followerUser.following.includes(followedUserId)) {
      return res.status(400).json("Already following this user");
    }

    // Add followed user to the follower's following list
    followerUser.following.push(followedUserId);

    // Add follower user to the followed user's followers list
    followedUser.followers.push(followerUserId);

    await followerUser.save();
    await followedUser.save();

    res.status(200).json("User followed successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to follow user");
  }
});

// Unfollow User
router.delete("/", checkAuth, async (req, res) => {
  const { followedUserId } = req.query;
  const followerUserId = req.userId;

  if (!followerUserId) return res.status(400).json("User not authenticated");

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(followedUserId)) {
    return res.status(400).json("Invalid followed user ID format");
  }

  try {
    // Find followed user
    const followedUser = await User.findById(followedUserId);
    if (!followedUser) return res.status(404).json("Followed user not found");

    // Find follower user
    const followerUser = await User.findById(followerUserId);
    if (!followerUser) return res.status(404).json("Follower not found");

    // Check if not following
    if (!followerUser.following.includes(followedUserId)) {
      return res.status(400).json("You are not following this user");
    }

    // Remove followed user from the follower's following list
    followerUser.following.pull(followedUserId);

    // Remove follower user from the followed user's followers list
    followedUser.followers.pull(followerUserId);

    await followerUser.save();
    await followedUser.save();

    res.status(200).json("User unfollowed successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to unfollow user");
  }
});

// Get Followers
router.get("/", async (req, res) => {
  const { userId } = req.query; // The user whose followers are requested

  console.log("Received userId:", userId); // Log the userId received

  if (!userId) return res.status(400).json("userId parameter is required");

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json("Invalid user ID format");
  }

  try {
    const user = await User.findById(userId).populate("followers", "username");
    if (!user) return res.status(404).json("User not found");

    const followers = user.followers;
    res.status(200).json(followers);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching followers");
  }
});

export default router;
