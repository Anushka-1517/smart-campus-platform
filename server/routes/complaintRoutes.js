import express from "express";

import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
} from "../controllers/complaintController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getComplaints);

router.get("/:id", protect, getComplaintById);

router.post("/", protect, createComplaint);

router.put("/:id/status", protect, updateComplaintStatus);

export default router;