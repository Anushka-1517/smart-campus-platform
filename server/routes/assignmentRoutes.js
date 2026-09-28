import express from "express";

import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getStudents,
  deleteAssignment,
} from "../controllers/assignmentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all assignments
router.get("/", protect, getAssignments);

// Get students for Faculty/Admin
router.get("/students", protect, (req, res, next) => {
  if (req.user.role !== "Faculty" && req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Only Faculty or Admin can view students.",
    });
  }

  next();
}, getStudents);

// Delete assignment
router.delete(
  "/:id",
  protect,
  (req, res, next) => {
    if (
      req.user.role !== "Faculty" &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        message: "Only Faculty or Admin can delete assignments.",
      });
    }

    next();
  },
  deleteAssignment
);

// Get one assignment
router.get("/:id", protect, getAssignmentById);

// Create assignment
router.post(
  "/",
  protect,
  (req, res, next) => {
    if (
      req.user.role !== "Faculty" &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        message: "Only Faculty or Admin can create assignments.",
      });
    }

    next();
  },
  createAssignment
);

// Submit assignment
router.put("/:id/submit", protect, submitAssignment);

export default router;