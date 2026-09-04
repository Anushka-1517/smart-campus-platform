import express from "express";

import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
} from "../controllers/assignmentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAssignments);

router.get("/:id", protect, getAssignmentById);

router.post("/", protect, createAssignment);

router.put("/:id/submit", protect, submitAssignment);

export default router;