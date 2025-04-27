import mongoose from "mongoose";
import User from "../models/User.js";

export const getUser = async (req, res) => {
  const { userId } = req.params;

  // Validate ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.userId; // assuming you're using authentication middleware

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  const { email, password, name, city, website, coverPic, profilePic } =
    req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        email,
        password,
        name,
        city,
        website,
        coverPic,
        profilePic,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user." });
  }
};

// controllers/user.js
export const getSuggestions = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const currentUser = await User.findById(currentUserId);
    const following = currentUser.following || [];

    // Suggest users the current user doesn't follow and is not themselves
    const suggestions = await User.find({
      _id: { $nin: [...following, currentUserId] },
    }).limit(5);

    // Format the suggestions data to only include necessary fields
    const formattedSuggestions = suggestions.map((user) => ({
      _id: user._id,
      name: user.name,
      username: user.username,
      profilePic: user.profilePic || "default-profile-pic-url.jpg", // Add a default profile pic if empty
    }));

    // Send the formatted data as the response
    res.status(200).json(formattedSuggestions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch suggestions", err });
  }
};
