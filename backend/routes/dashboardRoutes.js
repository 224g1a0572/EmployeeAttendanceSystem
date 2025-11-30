import express from "express";
import { employeeDashboard, managerDashboard } from "../controllers/dashboardController.js";
import { protect, managerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/employee", protect, employeeDashboard);
router.get("/manager", protect, managerOnly, managerDashboard);

export default router;
