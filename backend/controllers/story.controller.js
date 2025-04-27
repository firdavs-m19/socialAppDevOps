import Story from "../models/Story.js";
import User from "../models/User.js";

// GET /api/stories
// GET /api/stories
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("userId", "name profilePic")
      .sort({ createdAt: -1 });

    const formatted = stories.map((story) => ({
      id: story._id,
      img: `http://localhost:5000${story.img}`,
      name: story.userId.name,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.status(500).json({ message: "Failed to fetch stories" });
  }
};

// POST /api/stories
export const createStory = async (req, res) => {
  try {
    const { img } = req.body.img;
    console.log(img);

    if (!img) return res.status(400).json({ message: "Image is required" });

    const newStory = new Story({
      img,
      userId: req.userId, // from checkAuth middleware
    });

    console.log(newStory);

    await newStory.save();

    res.status(201).json({ message: "Story created", story: newStory });
  } catch (err) {
    console.error("Error creating story:", err);
    res.status(500).json({ message: "Failed to create story" });
  }
};
