import express from "express";

import {
  createTimetableEntry,
  getTimetable,
  getTimetableEntryById,
  deleteTimetableEntry,
} from "../controllers/timetableController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// View timetable
router.get("/", protect, getTimetable);

// Get one timetable entry
router.get("/:id", protect, getTimetableEntryById);

// Create timetable entry — Admin only
router.post(
  "/",
  protect,
  (req, res, next) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Only Admin can create timetable entries.",
      });
    }

    next();
  },
  createTimetableEntry
);

// Delete timetable entry — Admin only
router.delete(
  "/:id",
  protect,
  (req, res, next) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Only Admin can delete timetable entries.",
      });
    }

    next();
  },
  deleteTimetableEntry
);

export default router;