import express from "express";
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/complaintController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", protect, getComplaints);

router.get("/:id", protect, getComplaintById);

router.post("/", protect, createComplaint);

router.put("/:id/status", protect, updateComplaintStatus);

// Only Admin can delete complaints
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteComplaint
);

export default router;