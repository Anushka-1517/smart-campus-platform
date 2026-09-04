import { useEffect, useState } from "react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Assignments() {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/assignments");

        setAssignments(response.data.assignments || []);
      } catch (error) {
        console.error("Assignments error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load assignments. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const getAssignmentStatus = (assignment) => {
    if (
      Array.isArray(assignment.submissions) &&
      assignment.submissions.length > 0
    ) {
      const submission = assignment.submissions.find((item) => {
        const studentId =
          typeof item.student === "object"
            ? item.student?._id
            : item.student;

        return studentId === user?._id;
      });

      if (submission) {
        return submission.status;
      }
    }

    return "Pending";
  };

  const formatDueDate = (date) => {
    if (!date) {
      return "No due date";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSubmit = async (assignmentId) => {
    try {
      setSubmittingId(assignmentId);
      setError("");

      await api.put(`/assignments/${assignmentId}/submit`);

      setAssignments((currentAssignments) =>
        currentAssignments.map((assignment) => {
          if (assignment._id !== assignmentId) {
            return assignment;
          }

          const existingSubmissions = Array.isArray(
            assignment.submissions
          )
            ? assignment.submissions
            : [];

          const existingSubmissionIndex =
            existingSubmissions.findIndex((item) => {
              const studentId =
                typeof item.student === "object"
                  ? item.student?._id
                  : item.student;

              return studentId === user?._id;
            });

          const updatedSubmission = {
            student: user?._id,
            status: "Submitted",
            submittedAt: new Date().toISOString(),
          };

          if (existingSubmissionIndex !== -1) {
            const updatedSubmissions = [...existingSubmissions];

            updatedSubmissions[existingSubmissionIndex] =
              updatedSubmission;

            return {
              ...assignment,
              submissions: updatedSubmissions,
            };
          }

          return {
            ...assignment,
            submissions: [
              ...existingSubmissions,
              updatedSubmission,
            ],
          };
        })
      );
    } catch (error) {
      console.error("Assignment submission error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to submit the assignment. Please try again."
      );
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="assignments-page">
      <div className="assignments-header">
        <div>
          <p className="dashboard-label">ACADEMIC WORK</p>

          <h1>Assignments</h1>

          <p>
            View your assigned academic work, deadlines, and
            submission status.
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#fff4f2",
            color: "#b42318",
            border: "1px solid #f3c7c2",
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="assignment-page-card">
          <h2>Loading assignments...</h2>
          <p>
            Please wait while we fetch your assignments.
          </p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="assignment-page-card">
          <h2>No assignments yet</h2>
          <p>
            You currently have no assignments assigned to you.
          </p>
        </div>
      ) : (
        <div className="assignments-list">
          {assignments.map((assignment) => {
            const status = getAssignmentStatus(assignment);
            const isSubmitted = status === "Submitted";

            return (
              <article
                className="assignment-page-card"
                key={assignment._id}
              >
                <div className="assignment-card-header">
                  <div>
                    <span className="assignment-subject">
                      {assignment.subject}
                    </span>

                    <h2>{assignment.title}</h2>
                  </div>

                  <span
                    className={`badge ${
                      isSubmitted
                        ? "submitted"
                        : "pending"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <p className="assignment-description">
                  {assignment.description}
                </p>

                <div className="assignment-meta">
                  <div>
                    <span>Due Date</span>
                    <strong>
                      {formatDueDate(assignment.dueDate)}
                    </strong>
                  </div>

                  <div>
                    <span>Created By</span>
                    <strong>
                      {assignment.createdBy?.name ||
                        "Faculty"}
                    </strong>
                  </div>
                </div>

                <div className="assignment-actions">
                  <button
                    type="button"
                    onClick={() =>
                      handleSubmit(assignment._id)
                    }
                    disabled={
                      isSubmitted ||
                      submittingId === assignment._id
                    }
                  >
                    {submittingId === assignment._id
                      ? "Submitting..."
                      : isSubmitted
                      ? "Submitted"
                      : "Mark as Submitted"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Assignments;