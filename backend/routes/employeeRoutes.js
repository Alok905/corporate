import { Router } from "express";
import {
  approveEmployeeUpdation,
  deleteEmployeeUpdateApproval,
  getReportees,
  getReporteesById,
  login,
  registerEmployee,
  updateDetails,
  updateEmployeeById,
} from "../controllers/employeeController.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.js";

const router = Router();

router.route("/login").post(login);
router.route("/reportees").get(authenticate, getReportees);
router.route("/update").put(authenticate, updateDetails);

// send true or false for approval in the body
router
  .route("/approval/:employeeId")
  .put(authenticate, approveEmployeeUpdation);

router
  .route("/approval/:approvalId")
  .delete(authenticate, deleteEmployeeUpdateApproval);

// ADMIN ROUTES
router.route("/register").post(authenticate, authorizeAdmin, registerEmployee);
router
  .route("/:employeeId/reportees")
  .get(authenticate, authorizeAdmin, getReporteesById);

router
  .route("/update/:employeeId")
  .put(authenticate, authorizeAdmin, updateEmployeeById);

export default router;
