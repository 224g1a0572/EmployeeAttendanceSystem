import React, { useEffect, useState } from "react";
import api from "../api";

const MarkAttendance = () => {
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchToday = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/attendance/today");
      setTodayRecord(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await api.post("/api/attendance/checkin");
      fetchToday();
    } catch (error) {
      alert(error.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post("/api/attendance/checkout");
      fetchToday();
    } catch (error) {
      alert(error.response?.data?.message || "Check-out failed");
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  if (loading) return <div className="app-main">Loading...</div>;

  const status = todayRecord?.status || "not-marked";

  return (
    <div className="app-main">
      <div className="page-title">Mark Attendance</div>
      <div className="page-subtitle">
        Mark today&apos;s Check In and Check Out time.
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Today</div>
            <div className="card-subtitle">{new Date().toDateString()}</div>
          </div>
          <div className={`status-pill status-${status.replace(" ", "-")}`}>
            {status === "not-marked" ? "Not Marked" : status}
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <div className="label">Check In Time</div>
            <div style={{ fontSize: 14 }}>
              {todayRecord?.checkInTime
                ? new Date(todayRecord.checkInTime).toLocaleTimeString()
                : "-"}
            </div>
          </div>
          <div>
            <div className="label">Check Out Time</div>
            <div style={{ fontSize: 14 }}>
              {todayRecord?.checkOutTime
                ? new Date(todayRecord.checkOutTime).toLocaleTimeString()
                : "-"}
            </div>
          </div>
          <div>
            <div className="label">Total Hours</div>
            <div style={{ fontSize: 14 }}>
              {todayRecord?.totalHours?.toFixed(2) || "0.00"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.9rem" }}>
          <button className="btn" onClick={handleCheckIn}>
            Check In
          </button>
          <button className="btn btn-outline" onClick={handleCheckOut}>
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
