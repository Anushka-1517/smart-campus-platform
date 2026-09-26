import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  createUserByAdmin,
  getAllUsers,
  deleteUserByAdmin,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);

router.get("/me", protect, getCurrentUser);

// Only Admin can create Student or Faculty accounts
router.post(
  "/admin/create-user",
  protect,
  adminOnly,
  createUserByAdmin
);

// Only Admin can view Student and Faculty accounts
router.get(
  "/admin/users",
  protect,
  adminOnly,
  getAllUsers
);
// Only Admin can delete Student and Faculty accounts
router.delete(
  "/admin/users/:id",
  protect,
  adminOnly,
  deleteUserByAdmin
);
export default router;