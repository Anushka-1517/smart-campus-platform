import Assignment from "../models/Assignment.js";
import User from "../models/User.js";

// Create a new assignment
export const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      dueDate,
      assignedTo,
    } = req.body;

    if (!title || !description || !subject || !dueDate) {
      return res.status(400).json({
        message:
          "Title, description, subject, and due date are required.",
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      dueDate,
      createdBy: req.user._id,
      assignedTo: assignedTo || [],
    });

    const populatedAssignment = await assignment.populate([
      {
        path: "createdBy",
        select: "name email role",
      },
      {
        path: "assignedTo",
        select: "name email role",
      },
    ]);

    res.status(201).json({
      message: "Assignment created successfully.",
      assignment: populatedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create assignment.",
      error: error.message,
    });
  }
};

// Get assignments
export const getAssignments = async (req, res) => {
  try {
    let assignments;

    if (req.user.role === "Student") {
      assignments = await Assignment.find({
        $or: [
          { assignedTo: req.user._id },
          { assignedTo: { $size: 0 } },
        ],
      })
        .populate("createdBy", "name email role")
        .sort({ dueDate: 1 });
    } else {
      assignments = await Assignment.find()
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ dueDate: 1 });
    }

    res.status(200).json({
      assignments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignments.",
      error: error.message,
    });
  }
};

// Get a single assignment
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(
      req.params.id
    )
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    res.status(200).json({
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignment.",
      error: error.message,
    });
  }
};

// Submit an assignment
export const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    if (req.user.role !== "Student") {
      return res.status(403).json({
        message: "Only students can submit assignments.",
      });
    }

    const existingSubmission = assignment.submissions.find(
      (submission) =>
        submission.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      existingSubmission.status = "Submitted";
      existingSubmission.submittedAt = new Date();
    } else {
      assignment.submissions.push({
        student: req.user._id,
        status: "Submitted",
        submittedAt: new Date(),
      });
    }

    await assignment.save();

    res.status(200).json({
      message: "Assignment submitted successfully.",
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit assignment.",
      error: error.message,
    });
  }
};