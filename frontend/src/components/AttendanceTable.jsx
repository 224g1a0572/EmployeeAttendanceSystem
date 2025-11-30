import React from "react";

const StatusPill = ({ status }) => {
  const classMap = {
    present: "status-present",
    absent: "status-absent",
    late: "status-late",
    "half-day": "status-half-day"
  };
  const label = status?.replace("-", " ") || "N/A";
  return <span className={`status-pill ${classMap[status] || ""}`}>{label}</span>;
};

const AttendanceTable = ({ records }) => {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {records && records.length > 0 ? (
            records.map((r) => (
              <tr key={r._id}>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>
                  <StatusPill status={r.status} />
                </td>
                <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : "-"}</td>
                <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : "-"}</td>
                <td>{r.totalHours?.toFixed(2) || "0.00"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "0.8rem" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
