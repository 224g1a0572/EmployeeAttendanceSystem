import React, { useEffect, useState } from "react";
import api from "../api";
import SummaryCard from "../components/SummaryCard";

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/api/dashboard/manager");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!stats) return <div className="app-main">Loading dashboard...</div>;

  return (
    <div className="app-main">
      <div className="page-title">Manager Dashboard</div>
      <div className="page-subtitle">
        Team overview, trends and department-wise attendance.
      </div>

      <div className="grid grid-3">
        <SummaryCard
          title="Total Employees"
          value={stats.totalEmployees}
          accent="primary"
          subtitle="In the organization"
        />
        <SummaryCard
          title="Present Today"
          value={stats.todayAttendance.present}
          accent="success"
          subtitle="Employees who marked attendance"
        />
        <SummaryCard
          title="Absent Today"
          value={stats.todayAttendance.absent}
          accent="danger"
          subtitle="Employees not present"
        />
      </div>

      <div className="grid grid-2" style={{ marginTop: "1.3rem" }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Weekly Attendance Trend</span>
          </div>
          {stats.weeklyTrend.map((day) => (
            <div key={day.date} className="mini-bar-row">
              <div className="mini-bar-label">{day.date}</div>
              <div className="mini-bar-track">
                <div
                  className="mini-bar-fill"
                  style={{ width: `${day.present * 8}%` }}
                />
              </div>
              <span style={{ fontSize: 12 }}>{day.present}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Department-wise Attendance</span>
          </div>
          {stats.departmentWise.map((dept) => (
            <div key={dept.department} className="mini-bar-row">
              <div className="mini-bar-label">{dept.department}</div>
              <div className="mini-bar-track">
                <div
                  className="mini-bar-fill"
                  style={{
                    width: `${dept.present * 8}%`,
                    background: "linear-gradient(90deg,#38bdf8,#22c55e)"
                  }}
                />
              </div>
              <span style={{ fontSize: 12 }}>{dept.present}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "1.4rem" }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Late Arrivals & Absentees Today</span>
          </div>
          <div className="grid grid-2">
            <div>
              <div className="label">Late Arrivals</div>
              <ul style={{ paddingLeft: "1rem", fontSize: 13 }}>
                {stats.lateArrivals.length === 0 && <li>None 🎉</li>}
                {stats.lateArrivals.map((r) => (
                  <li key={r._id}>
                    {r.userId?.name} ({r.userId?.employeeId})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="label">Absent Employees</div>
              <ul style={{ paddingLeft: "1rem", fontSize: 13 }}>
                {stats.absentEmployees.length === 0 && <li>None 🎉</li>}
                {stats.absentEmployees.map((u) => (
                  <li key={u._id}>
                    {u.name} ({u.employeeId})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
