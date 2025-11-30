import dayjs from "dayjs";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// Employee dashboard stats
export const employeeDashboard = async (req, res) => {
  try {
    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();

    const todayRecord = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    const monthStart = dayjs().startOf("month").toDate();
    const monthEnd = dayjs().endOf("month").toDate();

    const monthRecords = await Attendance.find({
      userId: req.user._id,
      date: { $gte: monthStart, $lte: monthEnd }
    }).sort({ date: -1 });

    let present = 0,
      absent = 0,
      late = 0,
      totalHours = 0;

    monthRecords.forEach((r) => {
      if (r.status === "present") present++;
      if (r.status === "absent") absent++;
      if (r.status === "late") late++;
      totalHours += r.totalHours || 0;
    });

    const last7Days = await Attendance.find({
      userId: req.user._id,
      date: { $gte: dayjs().subtract(7, "day").startOf("day").toDate() }
    }).sort({ date: -1 });

    res.json({
      todayStatus: todayRecord?.status || "not-marked",
      monthSummary: { present, absent, late, totalHours },
      recentAttendance: last7Days
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Manager dashboard stats
export const managerDashboard = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });

    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();
    const todayRecords = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate("userId", "department");

    const present = todayRecords.filter(
      (r) => r.status === "present" || r.status === "late" || r.status === "half-day"
    ).length;
    const absent = totalEmployees - present;
    const lateArrivals = todayRecords.filter((r) => r.status === "late");

    // Weekly attendance trend (simple: count presents per day)
    const weekStart = dayjs().subtract(6, "day").startOf("day");
    const weeklyTrend = [];

    for (let i = 0; i < 7; i++) {
      const day = weekStart.add(i, "day");
      const s = day.startOf("day").toDate();
      const e = day.endOf("day").toDate();
      const dayRecords = await Attendance.find({
        date: { $gte: s, $lte: e }
      });
      const dayPresent = dayRecords.filter(
        (r) => r.status === "present" || r.status === "late" || r.status === "half-day"
      ).length;
      weeklyTrend.push({
        date: day.format("DD MMM"),
        present: dayPresent
      });
    }

    // Department-wise attendance (today)
    const deptMap = {};
    todayRecords.forEach((r) => {
      const dept = r.userId?.department || "Unknown";
      if (!deptMap[dept]) deptMap[dept] = { present: 0 };
      if (["present", "late", "half-day"].includes(r.status)) {
        deptMap[dept].present += 1;
      }
    });

    const departmentWise = Object.entries(deptMap).map(([department, val]) => ({
      department,
      present: val.present
    }));

    // Absent employees today
    const presentUserIds = todayRecords.map(r => r.userId?._id?.toString()).filter(Boolean);
    const absentEmployees = await User.find({
      role: "employee",
      _id: { $nin: presentUserIds }
    }).select("name employeeId department");

    res.json({
      totalEmployees,
      todayAttendance: { present, absent },
      lateArrivals,
      weeklyTrend,
      departmentWise,
      absentEmployees
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
