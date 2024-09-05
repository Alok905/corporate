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
  getHierarchy,
  getHierarchyById
} from "../controllers/employeeController.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.js";

const router = Router();

router.route("/login").post(login);
router.route("/reportees").get(authenticate, getReportees);
router.route("/reportees/hierarchy").get(authenticate, getHierarchy);
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
  .route("/update/:employeeId")
  .put(authenticate, authorizeAdmin, updateEmployeeById);

router
  .route("/:employeeId/reportees")
  .get(authenticate, authorizeAdmin, getReporteesById);

router
  .route("/:employeeId/reportees/hierarchy")
  .get(authenticate, authorizeAdmin, getHierarchyById);


export default router;
