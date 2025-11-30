// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import EmployeeDashboard from "./pages/EmployeeDashboard";
// import ManagerDashboard from "./pages/ManagerDashboard";
// import MarkAttendance from "./pages/MarkAttendance";
// import MyAttendanceHistory from "./pages/MyAttendanceHistory";
// import Profile from "./pages/Profile";
// import AllEmployeesAttendance from "./pages/AllEmployeesAttendance";
// import TeamCalendarView from "./pages/TeamCalendarView";
// import Reports from "./pages/Reports";
// import { useAuthStore } from "./store/useAuthStore";

// const App = () => {
//   const { user } = useAuthStore();

//   return (
//     <div className="app-shell">
//       <Navbar />
//       <Routes>
//         <Route
//           path="/"
//           element={
//             user ? (
//               <Navigate
//                 to={user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard"}
//                 replace
//               />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />
//         <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
//         <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

//         {/* Shared protected routes */}
//         <Route element={<ProtectedRoute allowedRoles={["employee", "manager"]} />}>
//           <Route path="/profile" element={<Profile />} />
//         </Route>

//         {/* Employee routes */}
//         <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
//           <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
//           <Route path="/employee/mark" element={<MarkAttendance />} />
//           <Route path="/employee/history" element={<MyAttendanceHistory />} />
//         </Route>

//         {/* Manager routes */}
//         <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
//           <Route path="/manager/dashboard" element={<ManagerDashboard />} />
//           <Route path="/manager/attendance" element={<AllEmployeesAttendance />} />
//           <Route path="/manager/calendar" element={<TeamCalendarView />} />
//           <Route path="/manager/reports" element={<Reports />} />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import MarkAttendance from "./pages/MarkAttendance";
import MyAttendanceHistory from "./pages/MyAttendanceHistory";
import Profile from "./pages/Profile";
import AllEmployeesAttendance from "./pages/AllEmployeesAttendance";
import TeamCalendarView from "./pages/TeamCalendarView";
import Reports from "./pages/Reports";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  // pages where NO NAVBAR and NO LAYOUT should be shown
  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}

      {/* REMOVE app-shell wrapper on login/register */}
      <div className={!isAuthPage ? "app-shell" : ""}>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard"}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Shared protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["employee", "manager"]} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Employee */}
          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/mark" element={<MarkAttendance />} />
            <Route path="/employee/history" element={<MyAttendanceHistory />} />
          </Route>

          {/* Manager */}
          <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/attendance" element={<AllEmployeesAttendance />} />
            <Route path="/manager/calendar" element={<TeamCalendarView />} />
            <Route path="/manager/reports" element={<Reports />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
