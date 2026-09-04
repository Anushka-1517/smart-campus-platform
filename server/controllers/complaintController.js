import Complaint from "../models/Complaint.js";

// Create a new complaint
export const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required.",
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      reportedBy: req.user._id,
    });

    const populatedComplaint = await complaint.populate(
      "reportedBy",
      "name email role"
    );

    res.status(201).json({
      message: "Complaint submitted successfully.",
      complaint: populatedComplaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit complaint.",
      error: error.message,
    });
  }
};

// Get complaints
export const getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === "Student") {
      complaints = await Complaint.find({
        reportedBy: req.user._id,
      })
        .populate("reportedBy", "name email role")
        .sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find()
        .populate("reportedBy", "name email role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaints.",
      error: error.message,
    });
  }
};

// Get a single complaint
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    ).populate("reportedBy", "name email role");

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaint.",
      error: error.message,
    });
  }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }

    if (req.user.role === "Student") {
      return res.status(403).json({
        message: "Students cannot update complaint status.",
      });
    }

    if (status) {
      complaint.status = status;
    }

    if (resolutionNote !== undefined) {
      complaint.resolutionNote = resolutionNote;
    }

    await complaint.save();

    const updatedComplaint = await complaint.populate(
      "reportedBy",
      "name email role"
    );

    res.status(200).json({
      message: "Complaint updated successfully.",
      complaint: updatedComplaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update complaint.",
      error: error.message,
    });
  }
};