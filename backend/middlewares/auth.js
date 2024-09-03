import Employee from "../models/employeeModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    throw new Error("Token not found.");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const employee = await Employee.findById(decoded.userId);

  if (!employee) {
    throw new Error("User doesn't exist");
  }

  req.employee = employee;
  next();
});

const authorizeAdmin = asyncHandler(async (req, res, next) => {
  if (!(req.employee && req.employee.isAdmin)) {
    throw new Error("Not authorized as an admin.");
  }
  next();
});

export { authenticate, authorizeAdmin };
