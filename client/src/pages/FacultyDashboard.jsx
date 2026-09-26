import React from "react";
import { Link } from "react-router-dom";
function FacultyDashboard() {
  return (
    <div className="faculty-dashboard">
      <div className="role-dashboard-header">
        <div className="dashboard-label">FACULTY PORTAL</div>
        <h1>Faculty Dashboard</h1>
        <p>
          Welcome to the Smart Campus Faculty Portal.
        </p>
      </div>
      <div className="faculty-dashboard-grid">
        <Link
          to="/assignments"
          className="faculty-dashboard-card"
        >
          <h2>Assignments</h2>
          <p>
            Create and manage assignments for students.
          </p>
        </Link>
        <Link
          to="/announcements"
          className="faculty-dashboard-card"
        >
          <h2>Announcements</h2>
          <p>
            Share important notices with students.
          </p>
        </Link>
        <Link
          to="/timetable"
          className="faculty-dashboard-card"
        >
          <h2>Timetable</h2>
          <p>
            View your teaching schedule.
          </p>
        </Link>
        <Link
          to="/profile"
          className="faculty-dashboard-card"
        >
          <h2>My Profile</h2>
          <p>
            View and manage your faculty profile.
          </p>
        </Link>
      </div>
    </div>
  );
}
export default FacultyDashboard;