import express from "express";
import {
  getLikes,
  likePost,
  deleteLike,
} from "../controllers/like.controller.js";
import { checkAuth } from "../middleware/checkAuth.js";
import Like from "../models/Like.js";

const router = express.Router();

router.get("/", getLikes);
router.post("/", checkAuth, likePost);
router.delete("/", checkAuth, deleteLike);

export default router;
