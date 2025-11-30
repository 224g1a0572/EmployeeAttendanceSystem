Employee Attendance Management System

Smart Attendance Tracking • Role-Based Access • Modern UI • CSV Reports

A full-stack employee attendance system built using React (Vite) + Node.js + Express + MongoDB, with role-based dashboards, CSV export, and a beautiful dark/aesthetic UI inspired by SaaS dashboards.

Features
Authentication & Roles

Secure JWT Login & Registration

Two roles: Manager & Employee

Role-based routing & access control

Password hashing using bcrypt

 Manager Features

View all employees attendance

Filter by date range or employee ID

Team calendar view

Generate Monthly / Weekly reports

Download attendance as CSV file

Dashboard analytics (present, absent, hours worked)
Employee Features

Daily Check In / Check Out

View Weekly / Monthly attendance

View personal attendance history

Profile management

Dashboard with:

Today's Status

Present Days

Total Hours

Quick Check In / Check Out

Reports

Generate attendance reports

Filter by:

Start date

End date

Employee ID

Export results as CSV

CSV includes:

Employee name

Employee ID

Date

Status

Check In / Check Out

Total hours

 Frontend UI

Fully responsive

Gradient + Glassmorphism UI

Animated login & register pages

Clean dashboard layout

Neon-style buttons

Aesthetic report screen

 Tech Stack
Frontend

React (Vite)

Zustand state management

Axios

React Router

Modern CSS (glassmorphism, gradients)

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

bcrypt password hashing

Others

MongoDB Compass

Axios interceptors

Blob CSV generation

Protected API Routes

 Project Structure
attendance-pro-portal/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
│
└── README.md
 Installation Guide
Clone the project
git clone https://github.com/yourusername/attendance-pro-portal.git
cd attendance-pro-portal

 Backend Setup
Install dependencies
cd backend
npm install

Add .env file:
PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance_pro_portal
JWT_SECRET=supersecretjwtkey
CLIENT_URL=http://localhost:5173

Run backend
npm run dev

 Frontend Setup
Install dependencies
cd ../frontend
npm install

Add .env file:
VITE_API_URL=http://localhost:5000

Run frontend
npm run dev

 JWT Token Handling

Token saved as:

localStorage.setItem("token", ...)


Axios automatically adds token:

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

 CSV Export
Frontend:
const response = await api.get("/api/attendance/export", {
  params: { startDate, endDate, employeeId },
  responseType: "blob",
});


Backend:
router.get("/export", protect, exportAttendanceReport);
