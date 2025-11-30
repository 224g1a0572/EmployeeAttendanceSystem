import React, { useEffect, useState } from "react";
import api from "../api";
import SummaryCard from "../components/SummaryCard";
import AttendanceTable from "../components/AttendanceTable";

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/dashboard/employee");
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCheckIn = async () => {
    try {
      await api.post("/api/attendance/checkin");
      fetchDashboard();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Check-in failed");
    }
  };

  const handleQuickCheckOut = async () => {
    try {
      await api.post("/api/attendance/checkout");
      fetchDashboard();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Check-out failed");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="app-main">Loading dashboard...</div>;

  const todayStatus = data?.todayStatus || "not-marked";
  const summary = data?.monthSummary || {};
  const recent = data?.recentAttendance || [];

  return (
    <div className="app-main">
      <div className="page-title">Employee Dashboard</div>
      <div className="page-subtitle">
        View today&apos;s status, monthly summary and recent attendance.
      </div>

      <div className="grid grid-3">
        <SummaryCard
          title="Today's Status"
          value={
            todayStatus === "not-marked"
              ? "Not Marked"
              : todayStatus.charAt(0).toUpperCase() + todayStatus.slice(1)
          }
          accent={todayStatus === "present" ? "success" : todayStatus === "late" ? "warning" : "danger"}
          subtitle="Quick view of today's attendance"
        />
        <SummaryCard
          title="Present Days"
          value={summary.present || 0}
          accent="success"
          subtitle="This month"
        />
        <SummaryCard
          title="Total Hours"
          value={`${(summary.totalHours || 0).toFixed(1)} h`}
          accent="primary"
          subtitle="Hours worked this month"
        />
      </div>

      <div className="grid grid-2" style={{ marginTop: "1.2rem" }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Quick Check In/Out</span>
          </div>
          <p className="card-subtitle" style={{ marginBottom: "0.8rem" }}>
            Use these buttons to mark your attendance quickly.
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn" onClick={handleQuickCheckIn}>
              Check In
            </button>
            <button className="btn btn-outline" onClick={handleQuickCheckOut}>
              Check Out
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Monthly Breakdown</span>
          </div>
          <div className="mini-bar-row">
            <div className="mini-bar-label">Present</div>
            <div className="mini-bar-track">
              <div
                className="mini-bar-fill"
                style={{ width: `${(summary.present || 0) * 8}%` }}
              />
            </div>
            <span style={{ fontSize: 12 }}>{summary.present || 0} days</span>
          </div>
          <div className="mini-bar-row">
            <div className="mini-bar-label">Absent</div>
            <div className="mini-bar-track">
              <div
                className="mini-bar-fill"
                style={{
                  width: `${(summary.absent || 0) * 8}%`,
                  background: "linear-gradient(90deg,#f97373,#fecaca)"
                }}
              />
            </div>
            <span style={{ fontSize: 12 }}>{summary.absent || 0} days</span>
          </div>
          <div className="mini-bar-row">
            <div className="mini-bar-label">Late</div>
            <div className="mini-bar-track">
              <div
                className="mini-bar-fill"
                style={{
                  width: `${(summary.late || 0) * 8}%`,
                  background: "linear-gradient(90deg,#facc15,#fbbf24)"
                }}
              />
            </div>
            <span style={{ fontSize: 12 }}>{summary.late || 0} days</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.4rem" }}>
        <div className="card" style={{ marginBottom: "0.7rem" }}>
          <div className="card-header">
            <span className="card-title">Recent Attendance (Last 7 Days)</span>
          </div>
        </div>
        <AttendanceTable records={recent} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
