import React, { useEffect, useState } from "react";
import api from "../api";
import AttendanceTable from "../components/AttendanceTable";
import CalendarView from "../components/CalendarView";

const MyAttendanceHistory = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [records, setRecords] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/api/attendance/my-history", {
        params: { month, year }
      });
      setRecords(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [month, year]);

  const handleSelectDate = (day, status) => {
    if (!status) return;
    const dateStr = new Date(year, month - 1, day).toDateString();
    alert(`Date: ${dateStr}\nStatus: ${status}`);
  };

  return (
    <div className="app-main">
      <div className="page-title">My Attendance History</div>
      <div className="page-subtitle">
        Calendar view and detailed table of your attendance.
      </div>

      <div className="grid grid-2">
        <div>
          <div className="card" style={{ marginBottom: "0.7rem" }}>
            <div className="card-header">
              <span className="card-title">Select Month</span>
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <div className="label">Month</div>
                <select
                  className="select"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <div className="label">Year</div>
                <input
                  className="input"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <CalendarView
            year={year}
            month={month}
            records={records}
            onSelectDate={handleSelectDate}
          />
        </div>

        <div>
          <div className="card" style={{ marginBottom: "0.7rem" }}>
            <div className="card-header">
              <span className="card-title">Detailed History</span>
            </div>
          </div>
          <AttendanceTable records={records} />
        </div>
      </div>
    </div>
  );
};

export default MyAttendanceHistory;
