import React from "react";

const getStatusColorClass = (status) => {
  if (status === "present") return "calendar-status-present";
  if (status === "absent") return "calendar-status-absent";
  if (status === "late") return "calendar-status-late";
  if (status === "half-day") return "calendar-status-half-day";
  return "";
};

const CalendarView = ({ year, month, records, onSelectDate }) => {
  // month: 1-12
  const firstDay = new Date(year, month - 1, 1);
  const startingWeekDay = firstDay.getDay(); // 0-6
  const daysInMonth = new Date(year, month, 0).getDate();

  const recordMap = {};
  records.forEach((r) => {
    const d = new Date(r.date).getDate();
    recordMap[d] = r.status;
  });

  const cells = [];
  for (let i = 0; i < startingWeekDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const status = recordMap[d];
    const cls = getStatusColorClass(status);
    cells.push(
      <button
        key={d}
        className="calendar-day"
        type="button"
        onClick={() => onSelectDate && onSelectDate(d, status)}
      >
        <div className="calendar-date">{d}</div>
        {status && <div className={`calendar-status-dot ${cls}`} />}
      </button>
    );
  }

  const monthName = new Date(year, month - 1, 1).toLocaleString("default", { month: "long" });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">
            {monthName} {year}
          </div>
          <div className="card-subtitle">Tap a date to view details</div>
        </div>
        <div style={{ display: "flex", gap: 8, fontSize: 11 }}>
          <span className="badge-soft" style={{ borderColor: "#22c55e44", color: "#4ade80" }}>
            ● Present
          </span>
          <span className="badge-soft" style={{ borderColor: "#f9737344", color: "#fecaca" }}>
            ● Absent
          </span>
          <span className="badge-soft" style={{ borderColor: "#eab30844", color: "#facc15" }}>
            ● Late
          </span>
          <span className="badge-soft" style={{ borderColor: "#3b82f644", color: "#bfdbfe" }}>
            ● Half-day
          </span>
        </div>
      </div>
      <div className="calendar-grid">{cells}</div>
    </div>
  );
};

export default CalendarView;
