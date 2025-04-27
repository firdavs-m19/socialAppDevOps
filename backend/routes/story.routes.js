import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { getStories } from "../controllers/story.controller.js";
import { createStory } from "../controllers/story.controller.js";

const router = express.Router();

router.get("/", checkAuth, getStories);
router.post("/", checkAuth, createStory);

export default router;
