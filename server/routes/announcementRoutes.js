import express from "express";

import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
} from "../controllers/announcementController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all announcements
router.get("/", protect, getAnnouncements);

// Get a single announcement
router.get("/:id", protect, getAnnouncementById);

// Create an announcement
router.post("/", protect, createAnnouncement);

export default router;