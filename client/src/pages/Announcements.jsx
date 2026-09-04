import { useEffect, useState } from "react";

import api from "../services/api";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/announcements");

        setAnnouncements(response.data.announcements || []);
      } catch (error) {
        console.error("Announcements error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load announcements. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="announcements-page">
      <div className="announcements-header">
        <div>
          <p className="dashboard-label">CAMPUS UPDATES</p>

          <h1>Announcements</h1>

          <p>
            Stay updated with the latest news, notices, and important
            information from your campus.
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
        <div className="announcement-card">
          <h2>Loading announcements...</h2>
          <p>Please wait while we fetch the latest campus updates.</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="announcement-card">
          <h2>No announcements yet</h2>
          <p>There are currently no campus announcements.</p>
        </div>
      ) : (
        <div className="announcements-list">
          {announcements.map((announcement) => (
            <article
              className="announcement-card"
              key={announcement._id}
            >
              <div className="announcement-card-header">
                <div>
                  <h2>{announcement.title}</h2>

                  <small>
                    Posted{" "}
                    {announcement.createdAt
                      ? new Date(
                          announcement.createdAt
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </small>
                </div>

                <span
                  className={`badge ${
                    announcement.priority === "Important"
                      ? "important"
                      : "normal"
                  }`}
                >
                  {announcement.priority || "Normal"}
                </span>
              </div>

              <p className="announcement-content">
                {announcement.content}
              </p>

              <div className="announcement-footer">
                Posted by{" "}
                <strong>
                  {announcement.postedBy?.name || "Campus Admin"}
                </strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Announcements;