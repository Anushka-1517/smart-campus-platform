import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  const [timetable, setTimetable] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);

  const today = new Date();

  const formattedDate = today
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

  const todayName = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const currentHour = today.getHours();

  let greeting = "Good morning";

  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const [
          timetableResponse,
          announcementsResponse,
          assignmentsResponse,
        ] = await Promise.all([
          api.get("/timetable"),
          api.get("/announcements"),
          api.get("/assignments"),
        ]);

        setTimetable(timetableResponse.data.timetable || []);
        setAnnouncements(
          announcementsResponse.data.announcements || []
        );
        setAssignments(
          assignmentsResponse.data.assignments || []
        );
      } catch (error) {
        console.error("Home data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const todayClasses = timetable
    .filter(
      (item) =>
        item.day?.toLowerCase() === todayName.toLowerCase()
    )
    .sort((a, b) =>
      (a.startTime || "").localeCompare(b.startTime || "")
    );

  const recentAnnouncements = announcements.slice(0, 3);

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

  const upcomingAssignments = assignments
    .filter((assignment) => {
      if (!assignment.dueDate) {
        return false;
      }

      return new Date(assignment.dueDate) >= today;
    })
    .sort(
      (a, b) =>
        new Date(a.dueDate) - new Date(b.dueDate)
    )
    .slice(0, 3);

  const formatDueDate = (date) => {
    if (!date) {
      return "No due date";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="home-page">
      <section className="home-intro">
        <p className="home-date">{formattedDate}</p>

        <h1>{greeting} 👋</h1>

        <p className="home-subtitle">
          Here's what's happening around your campus today.
        </p>
      </section>

      <section className="home-main-grid">
        <div className="home-schedule">
          <div className="home-section-title">
            <div>
              <span>YOUR DAY</span>
              <h2>Today's Schedule</h2>
            </div>

            <Link to="/timetable">View timetable →</Link>
          </div>

          {loading ? (
            <div className="home-empty-state">
              <p>Loading today's schedule...</p>
            </div>
          ) : todayClasses.length === 0 ? (
            <div className="home-empty-state">
              <h3>No classes scheduled today</h3>
              <p>
                You don't have any classes scheduled for{" "}
                {todayName}.
              </p>
            </div>
          ) : (
            <div className="schedule-list">
              {todayClasses.map((item) => (
                <div
                  className="schedule-row"
                  key={item._id}
                >
                  <div className="schedule-time">
                    <strong>
                      {item.startTime?.split(" ")[0]}
                    </strong>
                    <span>
                      {item.startTime?.split(" ")[1]}
                    </span>
                  </div>

                  <div className="schedule-line"></div>

                  <div className="schedule-content">
                    <h3>{item.subject}</h3>

                    <p>
                      {item.room
                        ? `Room ${item.room}`
                        : "Room not assigned"}
                    </p>

                    {item.faculty?.name && (
                      <p>
                        Faculty: {item.faculty.name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="home-updates">
          <div className="home-section-title">
            <div>
              <span>STAY UPDATED</span>
              <h2>Recent Updates</h2>
            </div>
          </div>

          {loading ? (
            <div className="home-empty-state">
              <p>Loading recent updates...</p>
            </div>
          ) : recentAnnouncements.length === 0 ? (
            <div className="home-empty-state">
              <h3>No recent updates</h3>
              <p>
                There are currently no new campus announcements.
              </p>
            </div>
          ) : (
            <>
              {recentAnnouncements.map((announcement) => (
                <div
                  className="update-item"
                  key={announcement._id}
                >
                  <div className="update-dot"></div>

                  <div>
                    <h3>{announcement.title}</h3>

                    <p>
                      {announcement.postedBy?.name ||
                        "Campus Admin"}
                      {" · "}
                      {announcement.createdAt
                        ? new Date(
                            announcement.createdAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Recently"}
                    </p>
                  </div>
                </div>
              ))}

              <Link
                to="/announcements"
                className="home-text-link"
              >
                See all announcements →
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="home-work">
        <div className="home-section-title">
          <div>
            <span>ACADEMIC</span>
            <h2>Upcoming Deadlines</h2>
          </div>

          <Link to="/assignments">
            View assignments →
          </Link>
        </div>

        {loading ? (
          <div className="home-empty-state">
            <p>Loading assignments...</p>
          </div>
        ) : upcomingAssignments.length === 0 ? (
          <div className="home-empty-state">
            <h3>No upcoming deadlines</h3>
            <p>
              You currently have no upcoming assignment deadlines.
            </p>
          </div>
        ) : (
          <div className="work-list">
            {upcomingAssignments.map((assignment) => {
              const status = getAssignmentStatus(assignment);

              return (
                <div
                  className="work-row"
                  key={assignment._id}
                >
                  <div>
                    <h3>{assignment.title}</h3>

                    <p>
                      {assignment.subject} · Due{" "}
                      {formatDueDate(assignment.dueDate)}
                    </p>
                  </div>

                  <span
                    className={`work-status ${
                      status === "Submitted"
                        ? "completed"
                        : "pending"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="home-quick-actions">
        <div>
          <span>NEED SOMETHING?</span>
          <h2>Quick Actions</h2>
        </div>

        <div className="quick-action-links">
          <Link to="/complaints">
            Report a campus issue
          </Link>

          <Link to="/timetable">
            Check timetable
          </Link>

          <Link to="/profile">
            View profile
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;