import { useEffect, useState } from "react";

import api from "../services/api";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints");

      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error("Complaints error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load complaints. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await api.post("/complaints", {
        title,
        description,
      });

      setTitle("");
      setDescription("");
      setSuccess("Complaint submitted successfully.");

      await fetchComplaints();
    } catch (error) {
      console.error("Complaint submission error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to submit complaint. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return "resolved";
    }

    if (status === "In Progress") {
      return "in-progress";
    }

    return "pending";
  };

  return (
    <div className="complaints-page">
      <div className="complaints-header">
        <div>
          <p className="dashboard-label">CAMPUS SUPPORT</p>

          <h1>Complaints</h1>

          <p>
            Report campus issues and keep track of their resolution
            status.
          </p>
        </div>
      </div>

      <div className="complaints-layout">
        <section className="complaint-form-card">
          <div className="complaint-section-header">
            <h2>Report an Issue</h2>
            <p>
              Tell us about a problem that needs attention on
              campus.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="complaint-title">
                Complaint Title
              </label>

              <input
                id="complaint-title"
                type="text"
                placeholder="Enter complaint title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="complaint-description">
                Description
              </label>

              <textarea
                id="complaint-description"
                placeholder="Describe the issue in detail"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={5}
                required
              />
            </div>

            {error && (
              <div className="complaint-message complaint-error">
                {error}
              </div>
            )}

            {success && (
              <div className="complaint-message complaint-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="complaint-submit-button"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Complaint"}
            </button>
          </form>
        </section>

        <section className="complaints-list-section">
          <div className="complaint-section-header">
            <h2>My Complaints</h2>
            <p>Track the complaints you have submitted.</p>
          </div>

          {loading ? (
            <div className="complaint-empty-card">
              <h3>Loading complaints...</h3>
              <p>
                Please wait while we fetch your complaints.
              </p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="complaint-empty-card">
              <h3>No complaints yet</h3>
              <p>
                You have not submitted any campus complaints.
              </p>
            </div>
          ) : (
            <div className="complaints-list">
              {complaints.map((complaint) => (
                <article
                  className="complaint-card"
                  key={complaint._id}
                >
                  <div className="complaint-card-header">
                    <div>
                      <h3>{complaint.title}</h3>

                      <small>
                        Submitted{" "}
                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently"}
                      </small>
                    </div>

                    <span
                      className={`complaint-status ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <p className="complaint-description">
                    {complaint.description}
                  </p>

                  {complaint.resolutionNote && (
                    <div className="resolution-note">
                      <span>Resolution Note</span>
                      <p>{complaint.resolutionNote}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Complaints;