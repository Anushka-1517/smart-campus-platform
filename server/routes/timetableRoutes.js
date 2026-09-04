import express from "express";

import {
  createTimetableEntry,
  getTimetable,
  getTimetableEntryById,
} from "../controllers/timetableController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTimetable);

router.get("/:id", protect, getTimetableEntryById);

router.post("/", protect, createTimetableEntry);

export default router;