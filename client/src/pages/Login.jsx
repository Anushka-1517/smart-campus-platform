import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.user.role === "Student") {
        navigate("/dashboard");
      } else if (loggedInUser.user.role === "Faculty") {
        navigate("/faculty");
      } else if (loggedInUser.user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDemoAccount = (role) => {
    setError("");
    setDemoLoading(true);
    const demoAccounts = {
      Student: {
        email: "demo.student@smartcampus.com",
        password: "Demo@123",
      },
      Faculty: {
        email: "demo.faculty@smartcampus.com",
        password: "Demo@123",
      },
      Admin: {
        email: "demo.admin@smartcampus.com",
        password: "Demo@123",
      },
    };
    const selectedAccount = demoAccounts[role];
    setEmail(selectedAccount.email);
    setPassword(selectedAccount.password);
    setTimeout(() => {
      setDemoLoading(false);
    }, 300);
  };
  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>
            Login to your Smart Campus account
          </p>
        </div>
        {/* Login Form */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={6}
              required
            />
          </div>
          {error && (
            <p
              style={{
                color: "#b42318",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
          )}
          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="forgot-password"
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={loading || demoLoading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
        {/* Demo Accounts */}
        <div className="login-divider">
          <span>OR</span>
        </div>
        <div className="demo-section">
          <p className="demo-section-title">
            Try a Demo Account
          </p>
          <p className="demo-section-description">
            Explore Smart Campus using Demo Student and Fculty accounts.
          </p>
          <div className="demo-account-buttons">
            <button
              type="button"
              className="demo-account-button"
              onClick={() =>
                handleDemoAccount("Student")
              }
              disabled={loading || demoLoading}
            >
              Student Demo
            </button>
            <button
              type="button"
              className="demo-account-button"
              onClick={() =>
                handleDemoAccount("Faculty")
              }
              disabled={loading || demoLoading}
            >
              Faculty Demo
            </button>
          </div>
          <p className="demo-login-note">
            Click a role to automatically fill its demo credentials.
          </p>
        </div>
        {/* Footer */}
        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <span>
              Contact Campus Admin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;