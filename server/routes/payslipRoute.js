import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  createPayslip,
  getPayslip,
  getPayslipById,
} from "../controllers/payslipController.js";

const payslipRouter = Router();

payslipRouter.post("/", protect, createPayslip);
payslipRouter.get("/", protect, getPayslip);
payslipRouter.get("/:id", protect, getPayslipById);

export default payslipRouter;
