import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
priority: {
  type: String,
  enum: ["Low", "Medium", "High"],
  default: "Low"
},

aiReason: {
  type: String,
  default: ""
},

category: {
  type: String,
  enum: [
    "Academic",
    "Infrastructure",
    "Electrical",
    "Security",
    "Cleanliness",
    "Other",
  ],
  default: "Other",
},
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },

    resolutionNote: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;