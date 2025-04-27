import express from "express";

import { getComments } from "../controllers/comment.controller.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { createComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/", getComments);
router.post("/create", checkAuth, createComment);

export default router;
