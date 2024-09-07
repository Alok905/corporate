import { Router } from "express";
import {
  approveEmployeeUpdation,
  getReportees,
  getReporteesById,
  login,
  registerEmployee,
  updateDetails,
  updateEmployeeById,
  getEmployees,
  getHierarchy,
  getHierarchyById,
  getApprovals,
  logout,
} from "../controllers/employeeController.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.js";

const router = Router();

router.route("/login").post(login);
router.route("/logout").post(authenticate, logout);
router.route("/reportees").get(authenticate, getReportees);
router.route("/reportees/hierarchy").get(authenticate, getHierarchy);
router.route("/update").put(authenticate, updateDetails);
router.route("/approval").get(authenticate, getApprovals);

// send true or false for approval in the body
// router
//   .route("/approval/:employeeId")
//   .put(authenticate, approveEmployeeUpdation);

router
  .route("/approval/:approvalId")
  .put(authenticate, approveEmployeeUpdation);

// ADMIN ROUTES
router.route("/").get(authenticate, authorizeAdmin, getEmployees);

router.route("/register").post(authenticate, authorizeAdmin, registerEmployee);

router
  .route("/update/:employeeId")
  .put(authenticate, authorizeAdmin, updateEmployeeById);

router
  .route("/:employeeId/reportees")
  .get(authenticate, authorizeAdmin, getReporteesById);

router
  .route("/:employeeId/reportees/hierarchy")
  .get(authenticate, authorizeAdmin, getHierarchyById);

export default router;
