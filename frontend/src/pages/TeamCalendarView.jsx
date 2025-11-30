import React, { useEffect, useState } from "react";
import api from "../api";

const TeamCalendarView = () => {
  const [todayStatus, setTodayStatus] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await api.get("/api/attendance/today-status");
      setTodayStatus(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (!todayStatus) return <div className="app-main">Loading...</div>;

  return (
    <div className="app-main">
      <div className="page-title">Team Calendar View</div>
      <div className="page-subtitle">
        Quick snapshot of today&apos;s attendance across the team.
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Present Today</span>
          </div>
          <ul style={{ paddingLeft: "1rem", fontSize: 13 }}>
            {todayStatus.present.length === 0 && <li>No one present yet</li>}
            {todayStatus.present.map((r) => (
              <li key={r._id}>
                {r.userId?.name} ({r.userId?.employeeId}) – {r.status}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Absent Today</span>
          </div>
          <ul style={{ paddingLeft: "1rem", fontSize: 13 }}>
            {todayStatus.absent.length === 0 && <li>No absentees 🎉</li>}
            {todayStatus.absent.map((u) => (
              <li key={u._id}>
                {u.name} ({u.employeeId})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamCalendarView;
