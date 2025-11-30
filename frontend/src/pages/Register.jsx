import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Register = () => {
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    department: "",
    role: "employee"
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(form);
      if (user.role === "manager") {
        navigate("/manager/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch {
      // error handled
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="card-header">
          <div>
            <div className="card-title">Create an account ✨</div>
            <div className="card-subtitle">Register as a new employee</div>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "0.75rem",
              padding: "0.55rem 0.75rem",
              borderRadius: 12,
              fontSize: 12,
              background: "rgba(248,113,113,0.16)",
              color: "#fecaca",
              border: "1px solid rgba(248,113,113,0.5)"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="label">Name</div>
            <input
              className="input"
              name="name"
              placeholder="Employee Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <div className="label">Email</div>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <div className="label">Password</div>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <div className="label">Employee ID</div>
              <input
                className="input"
                name="employeeId"
                placeholder="EMP001"
                value={form.employeeId}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <div className="label">Department</div>
              <input
                className="input"
                name="department"
                placeholder="Engineering"
                value={form.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label">Role</div>
            <select
              className="select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <button className="btn" type="submit" disabled={isLoading} style={{ width: "100%", marginTop: "0.25rem" }}>
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div
          style={{
            marginTop: "0.85rem",
            fontSize: 12,
            color: "var(--text-muted)",
            textAlign: "center"
          }}
        >
          Already registered?{" "}
          <Link to="/login" style={{ color: "#a5b4fc", textDecoration: "none" }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
