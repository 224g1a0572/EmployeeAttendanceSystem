import React, { useState } from "react";
import api from "../api";

const Reports = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    employeeId: ""
  });
  const [records, setRecords] = useState([]);

  const handleChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const fetchReport = async (e) => {
    e.preventDefault();
    try {
      // For table display, reuse /attendance/all with date filters
      const params = {};
      if (filters.employeeId) params.employeeId = filters.employeeId;
      if (filters.startDate && filters.endDate) {
        // We'll just filter client side by date range here after fetching all
      }
      const res = await api.get("/api/attendance/all", { params });
      let data = res.data;
      if (filters.startDate && filters.endDate) {
        const s = new Date(filters.startDate);
        const e = new Date(filters.endDate);
        data = data.filter((r) => {
          const d = new Date(r.date);
          return d >= s && d <= e;
        });
      }
      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  };

//   const handleExport = () => {
//     const url = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/attendance/export`;
//     window.open(url, "_blank");
//   };
const handleExport = async () => {
  try {
    const response = await api.get("/api/attendance/export", {
      params: {
        startDate: filters.startDate,
        endDate: filters.endDate,
        employeeId: filters.employeeId
      },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Export failed");
  }
};


  return (
    <div className="app-main">
      <div className="page-title">Reports</div>
      <div className="page-subtitle">
        Generate and export attendance reports as CSV.
      </div>

      <div className="card" style={{ marginBottom: "0.9rem" }}>
        <form onSubmit={fetchReport} className="grid grid-3">
          <div className="form-group">
            <div className="label">Start Date</div>
            <input
              className="input"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <div className="label">End Date</div>
            <input
              className="input"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <div className="label">Employee ID (optional)</div>
            <input
              className="input"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleChange}
              placeholder="EMP001 or leave blank"
            />
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn" type="submit">
              Generate Report
            </button>
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button
              className="btn btn-outline"
              type="button"
              onClick={handleExport}
            >
              Export CSV
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
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "0.8rem" }}>
                  Generate a report to see data.
                </td>
              </tr>
            )}
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.userId?.name}</td>
                <td>{r.userId?.employeeId}</td>
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

export default Reports;
// import React, { useState } from "react";
// import api from "../api";

// const Reports = () => {
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: "",
//     employeeId: ""
//   });

//   const [records, setRecords] = useState([]);

//   const handleChange = (e) => {
//     setFilters((f) => ({
//       ...f,
//       [e.target.name]: e.target.value
//     }));
//   };

//   // Generate on-screen report
//   const fetchReport = async (e) => {
//     e.preventDefault();

//     try {
//       let params = {};

//       if (filters.employeeId) params.employeeId = filters.employeeId;

//       // Fetch all first
//       const res = await api.get("/api/attendance/all", { params });
//       let data = res.data;

//       // Filter by date range (client-side)
//       if (filters.startDate && filters.endDate) {
//         const start = new Date(filters.startDate);
//         const end = new Date(filters.endDate);

//         data = data.filter((r) => {
//           const d = new Date(r.date);
//           return d >= start && d <= end;
//         });
//       }

//       setRecords(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Export CSV with token
//   const handleExport = async () => {
//     try {
//       const response = await api.get("/api/attendance/export", {
//         params: {
//           startDate: filters.startDate,
//           endDate: filters.endDate,
//           employeeId: filters.employeeId
//         },
//         responseType: "blob" // IMPORTANT
//       });

//       // Create CSV download
//       const blob = new Blob([response.data], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "attendance_report.csv";
//       link.click();
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Export failed");
//     }
//   };

//   return (
//     <div className="app-main">
//       <div className="page-title">Reports</div>
//       <div className="page-subtitle">Generate and export attendance reports as CSV.</div>

//       <div className="card" style={{ marginBottom: "0.9rem" }}>
//         <form onSubmit={fetchReport} className="grid grid-3">
          
//           <div className="form-group">
//             <div className="label">Start Date</div>
//             <input
//               className="input"
//               type="date"
//               name="startDate"
//               value={filters.startDate}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="form-group">
//             <div className="label">End Date</div>
//             <input
//               className="input"
//               type="date"
//               name="endDate"
//               value={filters.endDate}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="form-group">
//             <div className="label">Employee ID (optional)</div>
//             <input
//               className="input"
//               name="employeeId"
//               value={filters.employeeId}
//               onChange={handleChange}
//               placeholder="EMP001 or leave blank"
//             />
//           </div>

//           <div style={{ alignSelf: "flex-end" }}>
//             <button className="btn" type="submit">
//               Generate Report
//             </button>
//           </div>

//           <div style={{ alignSelf: "flex-end" }}>
//             <button
//               className="btn btn-outline"
//               type="button"
//               onClick={handleExport}
//             >
//               Export CSV
//             </button>
//           </div>

//         </form>
//       </div>

//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th>Employee</th>
//               <th>Emp ID</th>
//               <th>Date</th>
//               <th>Status</th>
//               <th>Check In</th>
//               <th>Check Out</th>
//             </tr>
//           </thead>

//           <tbody>
//             {records.length === 0 && (
//               <tr>
//                 <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
//                   Generate a report to see data.
//                 </td>
//               </tr>
//             )}

//             {records.map((r) => (
//               <tr key={r._id}>
//                 <td>{r.userId?.name}</td>
//                 <td>{r.userId?.employeeId}</td>
//                 <td>{new Date(r.date).toLocaleDateString()}</td>
//                 <td>{r.status}</td>
//                 <td>
//                   {r.checkInTime
//                     ? new Date(r.checkInTime).toLocaleTimeString()
//                     : "-"}
//                 </td>
//                 <td>
//                   {r.checkOutTime
//                     ? new Date(r.checkOutTime).toLocaleTimeString()
//                     : "-"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// };

// export default Reports;
