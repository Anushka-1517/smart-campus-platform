import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Loading profile...</h2>
          <p>Please wait while we load your profile information.</p>
        </div>
      </div>
    );
  }

  const name = user.name || "Student";
  const email = user.email || "Not available";
  const role = user.role || "Student";
  const department = user.department || "Not available";
  const year = user.year || "Not available";

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <div>
          <p className="dashboard-label">ACCOUNT</p>

          <h1>My Profile</h1>

          <p>
            View your personal and academic information connected
            to your Smart Campus account.
          </p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-card profile-summary">
          <div className="profile-avatar">{initials}</div>

          <h2>{name}</h2>

          <p className="profile-role">{role}</p>

          <div className="profile-summary-line"></div>

          <p className="profile-summary-text">
            {department}
          </p>
        </div>

        <div className="profile-card profile-information">
          <div className="profile-section-header">
            <h2>Personal & Academic Information</h2>

            <p>
              Your current information from your campus account.
            </p>
          </div>

          <div className="profile-details">
            <div className="profile-detail">
              <span>Name</span>
              <strong>{name}</strong>
            </div>

            <div className="profile-detail">
              <span>Email</span>
              <strong>{email}</strong>
            </div>

            <div className="profile-detail">
              <span>Role</span>
              <strong>{role}</strong>
            </div>

            <div className="profile-detail">
              <span>Department</span>
              <strong>{department}</strong>
            </div>

            <div className="profile-detail">
              <span>Year</span>
              <strong>{year}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;