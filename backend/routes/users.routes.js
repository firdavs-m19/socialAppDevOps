import express from "express";
import User from "../models/User.js"; // ❗This is missing

import {
  getSuggestions,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/", checkAuth, updateUser);

router.get("/suggestions", checkAuth, getSuggestions);

// router.get("/activities", checkAuth, async (req, res) => {
//   try {
//     const activities = await Activity.find({})
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .populate("userId", "username profilePic");

//     res.json(activities);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch activities", err });
//   }
// });
// router.get("/online", checkAuth, async (req, res) => {
//   try {
//     // You would manage online status with sockets or timestamps
//     const onlineUsers = await User.find({ isOnline: true });
//     res.json(onlineUsers);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch online users", err });
//   }
// });

export default router;
