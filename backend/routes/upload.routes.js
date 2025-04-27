import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Path to save uploaded files
const uploadPath = path.join(__dirname, "..", "public", "upload");

// Create the upload folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("file"), (req, res) => {
  try {
    console.log("File received:", req.file); // should not be undefined

    const imageUrl = `/upload/${req.file.filename}`; // this will match the static path served in index.js
    return res.status(200).json({ img: imageUrl });
  } catch (err) {
    console.error("File upload error:", err);
    return res.status(500).json({ message: "File upload failed" });
  }
});

export default router;
