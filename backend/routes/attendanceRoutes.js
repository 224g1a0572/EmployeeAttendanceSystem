import express from "express";
import {
  checkIn,
  checkOut,
  myHistory,
  mySummary,
  myTodayStatus,
  allAttendance,
  employeeAttendance,
  teamSummary,
  exportCsv,
  todayStatus
} from "../controllers/attendanceController.js";
import { protect, managerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee
router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);
router.get("/my-history", protect, myHistory);
router.get("/my-summary", protect, mySummary);
router.get("/today", protect, myTodayStatus);

// Manager
router.get("/all", protect, managerOnly, allAttendance);
router.get("/employee/:id", protect, managerOnly, employeeAttendance);
router.get("/summary", protect, managerOnly, teamSummary);
router.get("/export", protect, managerOnly, exportCsv);
router.get("/today-status", protect, managerOnly, todayStatus);

export default router;
