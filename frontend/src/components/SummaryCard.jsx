import React from "react";

const SummaryCard = ({ title, value, subtitle, accent = "primary" }) => {
  const accentColor =
    accent === "primary"
      ? "#6366f1"
      : accent === "success"
      ? "#22c55e"
      : accent === "danger"
      ? "#ef4444"
      : accent === "warning"
      ? "#eab308"
      : "#6366f1";

  return (
    <div className="card" style={{ padding: "1.1rem 1.3rem" }}>
      <div className="card-header">
        <span className="card-title" style={{ fontSize: "0.9rem" }}>
          {title}
        </span>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: `radial-gradient(circle, ${accentColor}, transparent)`
          }}
        />
      </div>
      <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{value}</div>
      {subtitle && (
        <div className="card-subtitle" style={{ marginTop: 4 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
