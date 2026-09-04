import Timetable from "../models/Timetable.js";

// Create a timetable entry
export const createTimetableEntry = async (req, res) => {
  try {
    const {
      day,
      subject,
      startTime,
      endTime,
      room,
      faculty,
      department,
      year,
    } = req.body;

    if (!day || !subject || !startTime || !endTime) {
      return res.status(400).json({
        message:
          "Day, subject, start time, and end time are required.",
      });
    }

    const timetableEntry = await Timetable.create({
      day,
      subject,
      startTime,
      endTime,
      room: room || "",
      faculty: faculty || null,
      department: department || "",
      year: year || "",
    });

    const populatedEntry = await timetableEntry.populate(
      "faculty",
      "name email role"
    );

    res.status(201).json({
      message: "Timetable entry created successfully.",
      timetableEntry: populatedEntry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create timetable entry.",
      error: error.message,
    });
  }
};

// Get timetable
export const getTimetable = async (req, res) => {
  try {
    const filter = {};

    if (req.user.department) {
      filter.department = req.user.department;
    }

    if (req.user.year) {
      filter.year = req.user.year;
    }

    const timetable = await Timetable.find(filter)
      .populate("faculty", "name email role")
      .sort({ day: 1, startTime: 1 });

    res.status(200).json({
      timetable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch timetable.",
      error: error.message,
    });
  }
};

// Get a single timetable entry
export const getTimetableEntryById = async (req, res) => {
  try {
    const timetableEntry = await Timetable.findById(
      req.params.id
    ).populate("faculty", "name email role");

    if (!timetableEntry) {
      return res.status(404).json({
        message: "Timetable entry not found.",
      });
    }

    res.status(200).json({
      timetableEntry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch timetable entry.",
      error: error.message,
    });
  }
};