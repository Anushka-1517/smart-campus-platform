import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/timetable", timetableRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Smart Campus API is running",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;