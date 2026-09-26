import React, { useEffect, useState } from "react";
function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    department: "",
    year: "",
  });
  const [accountMessage, setAccountMessage] = useState("");
  const [accountError, setAccountError] = useState("");
  useEffect(() => {
    fetchComplaints();
    fetchUsers();
  }, []);
  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this account?"
    );
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/auth/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user.");
      }
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== userId)
      );
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(error.message);
    }
  };
  const handleDeleteComplaint = async (complaintId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/complaints/${complaintId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete complaint.");
      }
      setComplaints((currentComplaints) =>
        currentComplaints.filter(
          (complaint) => complaint._id !== complaintId
        )
      );
    } catch (error) {
      console.error("Failed to delete complaint:", error);
      alert(error.message);
    }
  };
  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/complaints/${complaintId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update complaint status."
        );
      }
      setComplaints((currentComplaints) =>
        currentComplaints.map((complaint) =>
          complaint._id === complaintId
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );
    } catch (error) {
      console.error("Failed to update complaint status:", error);
      alert(error.message);
    }
  };
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  const handleAccountChange = (event) => {
    setAccountForm({
      ...accountForm,
      [event.target.name]: event.target.value,
    });
  };
  const handleCreateAccount = async (event) => {
    event.preventDefault();
    setAccountMessage("");
    setAccountError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/admin/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(accountForm),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setAccountError(
          data.message || "Failed to create account."
        );
        return;
      }
      setAccountMessage(
        `${data.user.role} account created successfully for ${data.user.name}.`
      );
      setAccountForm({
        name: "",
        email: "",
        password: "",
        role: "Student",
        department: "",
        year: "",
      });
      fetchUsers();
    } catch (error) {
      console.error("Account creation failed:", error);
      setAccountError(
        "Unable to connect to the server."
      );
    }
  };
  const highPriority = complaints.filter(
    (complaint) => complaint.priority === "High"
  ).length;
  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;
  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;
  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }
    if (priority === "Medium") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }
    return {
      background: "#dcfce7",
      color: "#166534",
    };
  };
  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        Loading Admin Dashboard...
      </div>
    );
  }
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-dashboard-header">
        <div className="dashboard-label">
          ADMINISTRATION PORTAL
        </div>
        <h1>Admin Dashboard</h1>
        <p>
          Manage campus accounts, users and complaints.
        </p>
      </div>
      {/* Statistics */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <h2>{complaints.length}</h2>
          <p>Total Complaints</p>
        </div>
        <div className="admin-stat-card">
          <h2>{pendingComplaints}</h2>
          <p>Pending Complaints</p>
        </div>
        <div className="admin-stat-card">
          <h2>{highPriority}</h2>
          <p>High Priority</p>
        </div>
        <div className="admin-stat-card">
          <h2>{resolvedComplaints}</h2>
          <p>Resolved Complaints</p>
        </div>
      </div>
      {/* Account Management */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Account Management</h2>
          <p>
            Create Student and Faculty accounts for the institution.
          </p>
        </div>
        <div className="admin-form-card">
          <form onSubmit={handleCreateAccount}>
            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={accountForm.name}
                onChange={handleAccountChange}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={accountForm.email}
                onChange={handleAccountChange}
                placeholder="Enter institutional email"
                required
              />
            </div>
            <div>
              <label>Temporary Password</label>
              <input
                type="password"
                name="password"
                value={accountForm.password}
                onChange={handleAccountChange}
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </div>
            <div>
              <label>Role</label>
              <select
                name="role"
                value={accountForm.role}
                onChange={handleAccountChange}
              >
                <option value="Student">
                  Student
                </option>
                <option value="Faculty">
                  Faculty
                </option>
              </select>
            </div>
            <div>
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={accountForm.department}
                onChange={handleAccountChange}
                placeholder="e.g. ECE"
              />
            </div>
            {accountForm.role === "Student" && (
              <div>
                <label>Year</label>
                <input
                  type="text"
                  name="year"
                  value={accountForm.year}
                  onChange={handleAccountChange}
                  placeholder="e.g. 4th Year"
                />
              </div>
            )}
            <button type="submit">
              Create Account
            </button>
          </form>
          {accountMessage && (
            <p className="admin-success">
              {accountMessage}
            </p>
          )}
          {accountError && (
            <p className="admin-error">
              {accountError}
            </p>
          )}
        </div>
      </section>
      {/* User Management */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>User Management</h2>
          <p>
            Students and Faculty accounts created by Administration.
          </p>
        </div>
        {users.length === 0 ? (
          <p>No Student or Faculty accounts found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.department || "-"}
                    </td>
                    <td>
                      {user.year || "-"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() =>
                          handleDeleteUser(user._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {/* Complaint Management */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Complaint Management</h2>
          <p>
            Review, prioritize and update campus complaints.
          </p>
        </div>
        {complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <div className="admin-complaint-list">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="admin-complaint-card"
              >
                <h3>{complaint.title}</h3>
                <p>
                  {complaint.description}
                </p>
                <div className="admin-complaint-meta">
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "600",
                      ...getPriorityStyle(
                        complaint.priority
                      ),
                    }}
                  >
                    AI Priority:{" "}
                    {complaint.priority || "Low"}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <select
                      value={
                        complaint.status || "Pending"
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          complaint._id,
                          event.target.value
                        )
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>
                      <option value="In Progress">
                        In Progress
                      </option>
                      <option value="Resolved">
                        Resolved
                      </option>
                    </select>
                  </div>
                </div>
                {complaint.aiReason && (
                  <p>
                    <strong>AI Reason:</strong>{" "}
                    {complaint.aiReason}
                  </p>
                )}
                <p>
                  <strong>Reported by:</strong>{" "}
                  {complaint.reportedBy?.name ||
                    "Student"}
                </p>
                <button
                  type="button"
                  className="admin-delete-button"
                  onClick={() =>
                    handleDeleteComplaint(
                      complaint._id
                    )
                  }
                >
                  Delete Complaint
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
export default AdminDashboard;