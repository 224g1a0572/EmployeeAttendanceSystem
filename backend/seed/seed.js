import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Attendance.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("password123", salt);

    const manager = await User.create({
      name: "Manager One",
      email: "manager@example.com",
      password: hashed,
      role: "manager",
      employeeId: "MGR001",
      department: "HR"
    });

    const emp1 = await User.create({
      name: "Employee One",
      email: "emp1@example.com",
      password: hashed,
      role: "employee",
      employeeId: "EMP001",
      department: "Engineering"
    });

    const emp2 = await User.create({
      name: "Employee Two",
      email: "emp2@example.com",
      password: hashed,
      role: "employee",
      employeeId: "EMP002",
      department: "Sales"
    });

    console.log("Seeded users:", manager.email, emp1.email, emp2.email);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
