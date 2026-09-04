import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          announcementsResponse,
          assignmentsResponse,
          complaintsResponse,
          timetableResponse,
        ] = await Promise.all([
          api.get("/announcements"),
          api.get("/assignments"),
          api.get("/complaints"),
          api.get("/timetable"),
        ]);

        setAnnouncements(announcementsResponse.data.announcements || []);
        setAssignments(assignmentsResponse.data.assignments || []);
        setComplaints(complaintsResponse.data.complaints || []);
        setTimetable(timetableResponse.data.timetable || []);
      } catch (error) {
        console.error("Dashboard data error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load dashboard data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const todayName = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todayClasses = timetable.filter(
    (item) => item.day?.toLowerCase() === todayName.toLowerCase()
  );

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

  const pendingAssignments = assignments.filter(
    (assignment) => getAssignmentStatus(assignment) !== "Submitted"
  );

  const inProgressComplaints = complaints.filter(
  (complaint) => complaint.status === "In Progress"
);

  const recentAnnouncements = announcements.slice(0, 2);
  const upcomingAssignments = assignments.slice(0, 3);

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

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-label">STUDENT OVERVIEW</p>
          <h1>Student Dashboard</h1>
          <p>Here's a quick look at your academic activities.</p>
        </div>

        <div className="dashboard-date">
          <span>Today</span>
          <strong>{formattedDate}</strong>
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

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card-label">ASSIGNMENTS</span>
          <h2>{loading ? "—" : assignments.length}</h2>
          <p>
            {loading
              ? "Loading..."
              : `${pendingAssignments.length} need your attention`}
          </p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">ANNOUNCEMENTS</span>
          <h2>{loading ? "—" : announcements.length}</h2>
          <p>
            {loading
              ? "Loading..."
              : announcements.length === 1
              ? "1 available"
              : `${announcements.length} available`}
          </p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">CAMPUS ISSUES</span>
          <h2>{loading ? "—" : complaints.length}</h2>
          <p>
            {loading
              ? "Loading..."
              : `${inProgressComplaints.length} currently in progress`}
          </p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">TODAY'S CLASSES</span>
          <h2>{loading ? "—" : todayClasses.length}</h2>
          <p>
            {loading
              ? "Loading..."
              : todayClasses.length > 0
              ? `Classes scheduled for ${todayName}`
              : "No classes scheduled"}
          </p>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span>RECENT</span>
              <h2>Announcements</h2>
            </div>
            <Link to="/announcements">View all →</Link>
          </div>

          {loading ? (
            <div className="dashboard-item">
              <div>
                <h3>Loading announcements...</h3>
                <p>Please wait while we fetch the latest updates.</p>
              </div>
            </div>
          ) : recentAnnouncements.length === 0 ? (
            <div className="dashboard-item">
              <div>
                <h3>No announcements yet</h3>
                <p>There are currently no campus announcements.</p>
              </div>
            </div>
          ) : (
            recentAnnouncements.map((announcement) => (
              <div className="dashboard-item" key={announcement._id}>
                <div>
                  <h3>{announcement.title}</h3>
                  <p>
                    {announcement.content ||
                      "No additional details available."}
                  </p>
                  <small>
                    Posted by{" "}
                    {announcement.postedBy?.name || "Campus Admin"}
                    {" · "}
                    {announcement.createdAt
                      ? new Date(
                          announcement.createdAt
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Recently"}
                  </small>
                </div>

                <span className="badge important">
                  {announcement.priority || "Important"}
                </span>
              </div>
            ))
          )}
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span>UPCOMING</span>
              <h2>Deadlines</h2>
            </div>
            <Link to="/assignments">View all →</Link>
          </div>

          {loading ? (
            <div className="dashboard-assignment">
              <div>
                <h3>Loading assignments...</h3>
                <p>Please wait while we fetch your assignments.</p>
              </div>
            </div>
          ) : upcomingAssignments.length === 0 ? (
            <div className="dashboard-assignment">
              <div>
                <h3>No assignments yet</h3>
                <p>You currently have no assignments.</p>
              </div>
            </div>
          ) : (
            upcomingAssignments.map((assignment) => {
              const status = getAssignmentStatus(assignment);

              return (
                <div
                  className="dashboard-assignment"
                  key={assignment._id}
                >
                  <div>
                    <h3>
                      {assignment.title ||
                        assignment.subject ||
                        "Assignment"}
                    </h3>

                    <p>
                      Due{" "}
                      {formatDueDate(
                        assignment.dueDate || assignment.deadline
                      )}
                    </p>
                  </div>

                  <span
                    className={`badge ${
                      status.toLowerCase() === "submitted"
                        ? "submitted"
                        : "pending"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;