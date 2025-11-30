import React, { useEffect, useState } from "react";
import api from "../api";

const AllEmployeesAttendance = () => {
  const [filters, setFilters] = useState({
    employeeId: "",
    date: "",
    status: ""
  });
  const [records, setRecords] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/attendance/all", { params: filters });
      setRecords(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="app-main">
      <div className="page-title">All Employees Attendance</div>
      <div className="page-subtitle">
        Filter by employee, date or status to view detailed records.
      </div>

      <div className="card" style={{ marginBottom: "0.9rem" }}>
        <form onSubmit={handleFilter} className="grid grid-3">
          <div className="form-group">
            <div className="label">Employee ID</div>
            <input
              className="input"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleChange}
              placeholder="EMP001"
            />
          </div>
          <div className="form-group">
            <div className="label">Date</div>
            <input
              className="input"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <div className="label">Status</div>
            <select
              className="select"
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half-day</option>
            </select>
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn" type="submit">
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Emp ID</th>
              <th>Dept</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "0.8rem" }}>
                  No records found.
                </td>
              </tr>
            )}
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.userId?.name}</td>
                <td>{r.userId?.employeeId}</td>
                <td>{r.userId?.department}</td>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.status}</td>
                <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : "-"}</td>
                <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEmployeesAttendance;
