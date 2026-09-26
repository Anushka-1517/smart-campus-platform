import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <div className="navbar-brand">
        <Link to="/">Smart Campus</Link>
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            {/* Student Navigation */}
            {user.role === "Student" && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/announcements">Announcements</Link>
                <Link to="/assignments">Assignments</Link>
                <Link to="/complaints">Complaints</Link>
                <Link to="/timetable">Timetable</Link>
                <Link to="/profile">Profile</Link>
              </>
            )}

            {/* Faculty Navigation */}
            {user.role === "Faculty" && (
              <>
                <Link to="/faculty">Faculty Dashboard</Link>
                <Link to="/announcements">Announcements</Link>
                <Link to="/assignments">Assignments</Link>
                <Link to="/timetable">Timetable</Link>
                <Link to="/profile">Profile</Link>
              </>
            )}

            {/* Admin Navigation */}
            {user.role === "Admin" && (
              <>
                <Link to="/admin">Admin Dashboard</Link>
                <Link to="/announcements">Announcements</Link>
                <Link to="/profile">Profile</Link>
              </>
            )}

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;