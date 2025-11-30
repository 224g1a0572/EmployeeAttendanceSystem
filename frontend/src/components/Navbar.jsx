import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const isManager = user.role === "manager";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "var(--nav-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.75rem",
        background: "linear-gradient(90deg, #020617, #020617dd, #020617)",
        borderBottom: "1px solid rgba(148,163,184,0.35)",
        zIndex: 20,
        backdropFilter: "blur(16px)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "999px",
            background:
              "conic-gradient(from 160deg, #22c55e, #6366f1, #06b6d4, #22c55e)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 0 0 3px rgba(15,23,42,0.8)"
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: "#0b1020"
            }}
          >
            EA
          </span>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Employee Attendance</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Smart attendance & analytics
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "0.6rem", fontSize: 13 }}>
          {isManager ? (
            <>
              <NavLink to="/manager/dashboard" label="Dashboard" current={location.pathname} />
              <NavLink to="/manager/attendance" label="Attendance" current={location.pathname} />
              <NavLink to="/manager/calendar" label="Team Calendar" current={location.pathname} />
              <NavLink to="/manager/reports" label="Reports" current={location.pathname} />
            </>
          ) : (
            <>
              <NavLink to="/employee/dashboard" label="Dashboard" current={location.pathname} />
              <NavLink to="/employee/mark" label="Mark Attendance" current={location.pathname} />
              <NavLink to="/employee/history" label="My History" current={location.pathname} />
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: 12
          }}
        >
          <Link
            to="/profile"
            style={{
              textDecoration: "none",
              color: "var(--text-main)",
              padding: "0.25rem 0.6rem",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.5)",
              background: "rgba(15,23,42,0.9)"
            }}
          >
            {user.name} • {user.role === "manager" ? "Manager" : "Employee"}
          </Link>
          <button className="btn btn-outline" style={{ paddingInline: "0.9rem" }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label, current }) => {
  const active = current.startsWith(to);
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        padding: "0.3rem 0.75rem",
        borderRadius: 999,
        background: active ? "var(--primary-soft)" : "transparent",
        color: active ? "#e5e7eb" : "var(--text-muted)",
        border: active ? "1px solid rgba(129,140,248,0.7)" : "1px solid transparent",
        transition: "background 0.16s ease-out, color 0.16s ease-out, border 0.16s ease-out"
      }}
    >
      {label}
    </Link>
  );
};

export default Navbar;
