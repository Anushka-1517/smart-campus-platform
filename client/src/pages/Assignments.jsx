import { useEffect, useState } from "react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Assignments() {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    assignedTo: "",
  });

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

  useEffect(() => {
    const fetchStudents = async () => {
      if (user?.role !== "Faculty") {
        return;
      }

      try {
        const response = await api.get("/assignments/students");

        setStudents(response.data.students || []);
      } catch (error) {
        console.error("Students error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load students."
        );
      }
    };

    fetchStudents();
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateAssignment = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);
      setError("");

      const response = await api.post("/assignments", {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        dueDate: formData.dueDate,
        assignedTo: formData.assignedTo
          ? [formData.assignedTo]
          : [],
      });

      setAssignments((current) => [
        response.data.assignment,
        ...current,
      ]);

      setFormData({
        title: "",
        description: "",
        subject: "",
        dueDate: "",
        assignedTo: "",
      });
    } catch (error) {
      console.error("Create assignment error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create assignment. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

 const handleDelete = async (assignmentId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this assignment?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setDeletingId(assignmentId);
    setError("");

    console.log("Deleting assignment:", assignmentId);

    const response = await api.delete(
      `/assignments/${assignmentId}`
    );

    console.log("Delete response:", response.data);

    setAssignments((currentAssignments) =>
      currentAssignments.filter(
        (assignment) => assignment._id !== assignmentId
      )
    );
  } catch (error) {
    console.error("Delete assignment error:", error);

    setError(
      error.response?.data?.message ||
        "Unable to delete the assignment. Please try again."
    );
  } finally {
    setDeletingId(null);
  }
};

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

  if (loading) {
    return (
      <div className="assignments-page">
        <div className="assignment-page-card">
          <h2>Loading assignments...</h2>
          <p>Please wait while we fetch your assignments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="assignments-page">
      <div className="assignments-header">
        <div>
          <p className="dashboard-label">ACADEMIC WORK</p>

          <h1>Assignments</h1>

          <p>
            {user?.role === "Faculty"
              ? "Create assignments and track student submissions."
              : "View your assigned academic work, deadlines, and submission status."}
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

      {/* FACULTY VIEW */}
      {user?.role === "Faculty" && (
        <>
          <div className="assignment-page-card">
            <h2>Create Assignment</h2>

            <p>
              Create academic work and assign it to a student.
            </p>

            <form
              onSubmit={handleCreateAssignment}
              style={{
                display: "grid",
                gap: "16px",
                marginTop: "20px",
              }}
            >
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="title"
                placeholder="Assignment title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />

              <textarea
                name="description"
                placeholder="Assignment description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              />

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />

              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                required
              >
                <option value="">
                  Select Student
                </option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.name} — {student.email}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={creating}
              >
                {creating
                  ? "Creating..."
                  : "Create Assignment"}
              </button>
            </form>
          </div>

          <div style={{ marginTop: "30px" }}>
            <h2>Created Assignments</h2>
          </div>

          {assignments.length === 0 ? (
            <div className="assignment-page-card">
              <h2>No assignments created yet</h2>

              <p>
                Create your first assignment using the form above.
              </p>
            </div>
          ) : (
            <div className="assignments-list">
              {assignments.map((assignment) => (
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
                  </div>

                  <p className="assignment-description">
                    {assignment.description}
                  </p>

                  <div className="assignment-meta">
                    <div>
                      <span>Due Date</span>

                      <strong>
                        {formatDueDate(
                          assignment.dueDate
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Assigned To</span>

                      <strong>
                        {assignment.assignedTo?.length
                          ? assignment.assignedTo
                              .map(
                                (student) =>
                                  student.name
                              )
                              .join(", ")
                          : "All Students"}
                      </strong>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "18px",
                      padding: "12px",
                      background: "#f8fafc",
                      borderRadius: "10px",
                    }}
                  >
                    <strong>Submission Status</strong>

                    <p style={{ marginTop: "6px" }}>
                      {assignment.submissions?.length
                        ? assignment.submissions.map(
                            (submission, index) => (
                              <span
                                key={
                                  submission.student ||
                                  index
                                }
                                style={{
                                  display: "block",
                                }}
                              >
                                {submission.status}
                              </span>
                            )
                          )
                        : "Pending"}
                    </p>
                  </div>

                  <div className="assignment-actions">
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(assignment._id)
                      }
                      disabled={
                        deletingId === assignment._id
                      }
                    >
                      {deletingId === assignment._id
                        ? "Deleting..."
                        : "Delete Assignment"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {/* STUDENT VIEW */}
      {user?.role === "Student" && (
        <>
          {assignments.length === 0 ? (
            <div className="assignment-page-card">
              <h2>No assignments yet</h2>

              <p>
                You currently have no assignments assigned
                to you.
              </p>
            </div>
          ) : (
            <div className="assignments-list">
              {assignments.map((assignment) => {
                const status =
                  getAssignmentStatus(assignment);

                const isSubmitted =
                  status === "Submitted";

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
                          {formatDueDate(
                            assignment.dueDate
                          )}
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
                          handleSubmit(
                            assignment._id
                          )
                        }
                        disabled={
                          isSubmitted ||
                          submittingId ===
                            assignment._id
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
        </>
      )}
    </div>
  );
}

export default Assignments;