import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // Respond with user data and token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic,
        coverPic: user.coverPic,
        city: user.city,
        website: user.website,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const register = async (req, res) => {
  const { username, email, password, name } = req.body;

  try {
    // Check for missing required fields
    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Check if username already exists
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name,
    });

    // Save to DB
    await newUser.save();

    // Generate token
    const token = jwt.sign({ userId: newUser._id }, "your_jwt_secret", {
      expiresIn: "30d",
    });

    // Respond with user data and token
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        profilePic: newUser.profilePic,
        coverPic: newUser.coverPic,
        city: newUser.city,
        website: newUser.website,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const logout = (req, res) => {
  try {
    // For stateless JWT, logout is handled on client by discarding the token.
    // You can optionally instruct the client to clear the token.
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout" });
  }
};
