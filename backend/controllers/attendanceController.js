import dayjs from "dayjs";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { stringify } from "csv-stringify/sync";

const getStartEndOfDate = (date = new Date()) => {
  const d = dayjs(date).startOf("day");
  return {
    start: d.toDate(),
    end: d.endOf("day").toDate()
  };
};

// Employee - Check In
export const checkIn = async (req, res) => {
  try {
    const { start, end } = getStartEndOfDate();
    let attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const now = new Date();
    const status = dayjs(now).hour() > 9 ? "late" : "present";

    if (!attendance) {
      attendance = await Attendance.create({
        userId: req.user._id,
        date: start,
        checkInTime: now,
        status
      });
    } else {
      attendance.checkInTime = now;
      attendance.status = status;
      await attendance.save();
    }

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Employee - Check Out
export const checkOut = async (req, res) => {
  try {
    const { start, end } = getStartEndOfDate();
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: "You must check in first" });
    }
    if (attendance.checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const now = new Date();
    attendance.checkOutTime = now;

    const diffMs = now - attendance.checkInTime;
    const hours = diffMs / (1000 * 60 * 60);
    attendance.totalHours = Math.round(hours * 100) / 100;

    if (attendance.totalHours < 4) {
      attendance.status = "half-day";
    }

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Employee - My History
export const myHistory = async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = { userId: req.user._id };

    if (month && year) {
      const start = dayjs(`${year}-${month}-01`).startOf("month").toDate();
      const end = dayjs(start).endOf("month").toDate();
      filter.date = { $gte: start, $lte: end };
    }

    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Employee - My Summary (monthly)
export const mySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = dayjs(`${year}-${month}-01`).startOf("month").toDate();
    const end = dayjs(start).endOf("month").toDate();

    const records = await Attendance.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    let present = 0,
      absent = 0,
      late = 0,
      halfDay = 0,
      totalHours = 0;

    records.forEach((r) => {
      if (r.status === "present") present++;
      if (r.status === "absent") absent++;
      if (r.status === "late") late++;
      if (r.status === "half-day") halfDay++;
      totalHours += r.totalHours || 0;
    });

    res.json({ present, absent, late, halfDay, totalHours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Employee - Today's status
export const myTodayStatus = async (req, res) => {
  try {
    const { start, end } = getStartEndOfDate();
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });
    res.json(attendance || { status: "not-marked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Manager - All employees attendance (with filters)
export const allAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.query;
    let filter = {};

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) filter.userId = user._id;
    }
    if (date) {
      const { start, end } = getStartEndOfDate(date);
      filter.date = { $gte: start, $lte: end };
    }
    if (status) {
      filter.status = status;
    }

    const records = await Attendance.find(filter).populate("userId", "name employeeId department");
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Manager - Specific employee
export const employeeAttendance = async (req, res) => {
  try {
    const userId = req.params.id;
    const records = await Attendance.find({ userId }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Manager - Team summary
export const teamSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};
    if (startDate && endDate) {
      filter.date = {
        $gte: dayjs(startDate).startOf("day").toDate(),
        $lte: dayjs(endDate).endOf("day").toDate()
      };
    }

    const records = await Attendance.find(filter);
    let present = 0,
      absent = 0,
      late = 0,
      halfDay = 0;

    records.forEach((r) => {
      if (r.status === "present") present++;
      if (r.status === "absent") absent++;
      if (r.status === "late") late++;
      if (r.status === "half-day") halfDay++;
    });

    res.json({ present, absent, late, halfDay });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Manager - Export CSV
export const exportCsv = async (req, res) => {
  try {
    const records = await Attendance.find({})
      .populate("userId", "name employeeId department")
      .sort({ date: -1 });

    const data = records.map((r) => ({
      EmployeeName: r.userId?.name || "",
      EmployeeId: r.userId?.employeeId || "",
      Department: r.userId?.department || "",
      Date: dayjs(r.date).format("YYYY-MM-DD"),
      Status: r.status,
      CheckIn: r.checkInTime ? dayjs(r.checkInTime).format("HH:mm") : "",
      CheckOut: r.checkOutTime ? dayjs(r.checkOutTime).format("HH:mm") : "",
      TotalHours: r.totalHours
    }));

    const csv = stringify(data, { header: true });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance_report.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Manager - today's status for everyone
export const todayStatus = async (req, res) => {
  try {
    const { start, end } = getStartEndOfDate();
    const records = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate("userId", "name employeeId department");

    const present = records.filter(r => r.status === "present" || r.status === "late" || r.status === "half-day");
    const absentEmployees = await User.find({
      _id: { $nin: records.map(r => r.userId._id) },
      role: "employee"
    });

    res.json({
      present,
      absent: absentEmployees
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
