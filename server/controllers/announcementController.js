import Announcement from "../models/Announcement.js";

// Create a new announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const announcement = await Announcement.create({
      title,
      content,
      priority: priority || "Normal",
      postedBy: req.user._id,
    });

    const populatedAnnouncement = await announcement.populate(
      "postedBy",
      "name email role"
    );

    res.status(201).json({
      message: "Announcement created successfully.",
      announcement: populatedAnnouncement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create announcement.",
      error: error.message,
    });
  }
};

// Get all announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      announcements,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch announcements.",
      error: error.message,
    });
  }
};

// Get a single announcement
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(
      req.params.id
    ).populate("postedBy", "name email role");

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found.",
      });
    }

    res.status(200).json({
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch announcement.",
      error: error.message,
    });
  }
};