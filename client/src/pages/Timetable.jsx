import { useEffect, useState } from "react";

import api from "../services/api";

function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/timetable");

        setTimetable(response.data.timetable || []);
      } catch (error) {
        console.error("Timetable error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load timetable. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getClassesForDay = (day) => {
    return timetable
      .filter((item) => item.day === day)
      .sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });
  };

  return (
    <div className="timetable-page">
      <div className="timetable-header">
        <div>
          <p className="dashboard-label">ACADEMIC SCHEDULE</p>

          <h1>Timetable</h1>

          <p>
            View your weekly class schedule, subjects, timings, and
            classroom information.
          </p>
        </div>
      </div>

      {error && (
        <div className="timetable-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="timetable-empty-card">
          <h2>Loading timetable...</h2>
          <p>
            Please wait while we fetch your class schedule.
          </p>
        </div>
      ) : timetable.length === 0 ? (
        <div className="timetable-empty-card">
          <h2>No timetable available</h2>
          <p>
            There are currently no classes scheduled for your
            account.
          </p>
        </div>
      ) : (
        <div className="timetable-grid">
          {days.map((day) => {
            const classes = getClassesForDay(day);

            return (
              <section
                className="timetable-day-card"
                key={day}
              >
                <div className="timetable-day-header">
                  <h2>{day}</h2>
                  <span>
                    {classes.length}{" "}
                    {classes.length === 1
                      ? "class"
                      : "classes"}
                  </span>
                </div>

                {classes.length === 0 ? (
                  <div className="no-class">
                    No classes scheduled
                  </div>
                ) : (
                  <div className="class-list">
                    {classes.map((item) => (
                      <div
                        className="class-card"
                        key={item._id}
                      >
                        <div className="class-time">
                          <strong>
                            {item.startTime}
                          </strong>
                          <span>{item.endTime}</span>
                        </div>

                        <div className="class-details">
                          <h3>{item.subject}</h3>

                          {item.room && (
                            <p>📍 {item.room}</p>
                          )}

                          {item.faculty?.name && (
                            <p>
                              Faculty:{" "}
                              {item.faculty.name}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Timetable;