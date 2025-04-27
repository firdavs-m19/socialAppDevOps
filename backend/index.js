import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import postRoutes from "./routes/posts.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import likeRoutes from "./routes/likes.routes.js";
import uploadRoute from "./routes/upload.routes.js";
import relationshipsRoute from "./routes/relationship.routes.js";
import storyRoute from "./routes/story.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL =
  "mongodb+srv://firdavsmuhammadjonov19:GAKRn019PQZlwAj8@cluster0.ebyi4ha.mongodb.net/social?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend origin
    credentials: true, // allow cookies if you're using them
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" folder
app.use("/upload", express.static(path.join(__dirname, "public/upload")));

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipsRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/stories", storyRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
