import express from "express";
import { createPost, getPosts } from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/create", verifyToken, createPost);

export default router;
