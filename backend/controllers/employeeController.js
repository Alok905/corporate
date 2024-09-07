import bcrypt from "bcryptjs";
import Employee from "../models/employeeModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import validatePassword from "../utils/validatePassword.js";
import createToken from "../utils/createToken.js";
import getHierarchialData from "../utils/getHierarchialData.js";
import Approval from "../models/approvalModel.js";

// All Users Controllers
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("email and password are required.");
  }

  const employee = await Employee.findOne({ email });
  if (!employee) {
    throw new Error("Email doesn't exists.");
  }

  const isMatched = bcrypt.compare(password, employee.password);
  if (!isMatched) {
    throw new Error("Wrong credentials.");
  }

  createToken(res, employee._id);

  delete employee.password;
  delete employee.reportees;

  res.status(201).json(employee);
});

const logout = asyncHandler(async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
});

const getReportees = asyncHandler(async (req, res, next) => {
  const reportees = await Employee.findById(req.employee._id, {
    reportees: 1,
  }).populate("reportees");

  res.status(201).json({
    status: "success",
    data: reportees,
  });
});

const getHierarchy = asyncHandler(async (req, res, next) => {
  const employee = await getHierarchialData(req.employee._id);

  res.status(201).json({
    status: "success",
    data: employee,
  });
});

const updateDetails = asyncHandler(async (req, res, next) => {
  const { personalEmail, password, mobile } = req.body;

  if (req.employee.role === "CEO") {
    personalEmail && (req.employee.personalEmail = personalEmail);
    password && (req.employee.password = password);
    mobile && (req.employee.mobile = mobile);

    await req.employee.save();

    return res.status(201).json({
      status: "success",
      message: "data updated.",
      data: req.employee,
    });
  }

  let update = {};
  personalEmail && (update = { ...update, personalEmail });
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    update = {
      ...update,
      password: hashedPassword,
    };
  }
  mobile && (update = { ...update, mobile });

  const reporter = await Employee.findById(req.employee.reporter);

  const approvalExists = await Approval.findOne({
    $and: [{ from: req.employee._id }, { status: "PENDING" }],
  });

  if (approvalExists) {
    approvalExists.update = update;
    await approvalExists.save();
  } else {
    const newApproval = new Approval({
      from: req.employee._id,
      to: req.employee.reporter,
      update,
    });

    reporter.approvals.push(newApproval._id);
    await newApproval.save();
    await reporter.save();
  }

  res.status(201).json({
    status: "success",
    message: "pending for approval",
    data: null,
  });
});

const getApprovals = asyncHandler(async (req, res, next) => {
  const status = req.query?.status;
  const findQuery =
    !status || status.length === 0
      ? { $or: [{ from: req.employee._id }, { to: req.employee._id }] }
      : status.toUpperCase() === "SELF_REQUESTED"
      ? { from: req.employee._id }
      : { status: status.toUpperCase() };

  const approvals = await Approval.find(findQuery);

  res.status(201).json({
    status: "success",
    data: approvals,
  });
});

const approveEmployeeUpdation = asyncHandler(async (req, res, next) => {
  const { approvalId } = req.params;

  if (!approvalId) {
    throw new Error("Approval ID is required.");
  }

  const approval = await Approval.findById(approvalId);

  if (!approval || approval.to.toString() !== req.employee._id.toString()) {
    throw new Error("Invalid approval ID");
  }

  const requestingEmployee = await Employee.findById(approval.from);
  const { approved: isApproved } = req.body;

  approval.status = isApproved ? "APPROVED" : "REJECTED";

  if (isApproved) {
    approval.update.personalEmail &&
      (requestingEmployee.personalEmail = approval.update.personalEmail);
    approval.update.password &&
      (requestingEmployee.password = approval.update.password);
    approval.update.mobile &&
      (requestingEmployee.mobile = approval.update.mobile);
  }

  await approval.save();
  await requestingEmployee.save();

  res.status(201).json({
    status: "success",
    data: null,
  });
});

//////////////////
// Admin Controllers
const registerEmployee = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    personalEmail,
    password,
    mobile,
    role,
    reporterEmail,
    isAdmin,
  } = req.body;

  if (!name || !email || !password || !mobile || !role || !reporterEmail) {
    throw new Error("All fields are required.");
  }

  if (!validatePassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long containing at lease one uppercase letter, one lowercase letter, one number and one special character."
    );
  }

  const reporterEmployee = await Employee.findOne({ email: reporterEmail });

  if (!reporterEmployee) {
    throw new Error(`No employee found having email: ${reporterEmail}`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let newEmployeeDetails = {
    name,
    email,
    password: hashedPassword,
    mobile,
    role,
  };

  isAdmin && (newEmployeeDetails = { ...newEmployeeDetails, isAdmin });

  reporterEmployee &&
    (newEmployeeDetails = {
      ...newEmployeeDetails,
      reporter: reporterEmployee?._id,
    });

  personalEmail &&
    (newEmployeeDetails = { ...newEmployeeDetails, personalEmail });

  const newEmployee = new Employee(newEmployeeDetails);
  reporterEmployee?.reportees.push(newEmployee._id);

  await reporterEmployee?.save();
  await newEmployee.save();

  delete newEmployee.password;

  res.status(201).json({
    status: "success",
    data: newEmployee,
  });
});

const getEmployees = asyncHandler(async (req, res, next) => {
  const search = req.query.search;
  let searchRegex = /^.*$/;
  if (search) {
    searchRegex = `.*${search.split("").join(".*")}.*`;
  }
  const employees = await Employee.find(
    {
      $or: [
        { email: { $regex: searchRegex, $options: "i" } },
        { name: { $regex: searchRegex, $options: "i" } },
      ],
    },
    { name: 1, email: 1, role: 1 }
  );

  res.status(201).json({
    status: "success",
    data: employees,
  });
});

const getReporteesById = asyncHandler(async (req, res, next) => {
  const { employeeId } = req.params;
  if (!employeeId) {
    throw new Error("Employee Id is required.");
  }

  const reportees = await Employee.findById(employeeId, {
    reportees: 1,
  }).populate("reportees");

  res.status(201).json({
    status: "success",
    data: reportees,
  });
});

const getHierarchyById = asyncHandler(async (req, res, next) => {
  let { employeeId } = req.params;
  if (!employeeId) {
    throw new Error("Employee ID is required.");
  }

  if (employeeId == "root") employeeId = await Employee.find({ role: "CEO" });

  const employee = await getHierarchialData(employeeId);

  res.status(201).json({
    status: "success",
    data: employee,
  });
});

const updateEmployeeById = asyncHandler(async (req, res, next) => {
  const { employeeId } = req.params;
  if (!employeeId) {
    throw new Error("Employee ID is required.");
  }
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    throw new Error("Employee doesn't exist.");
  }

  const {
    name,
    email,
    personalEmail,
    password,
    mobile,
    role,
    reporterEmail,
    isAdmin,
  } = req.body;

  name && (employee.name = name);
  email && (employee.email = email);
  personalEmail && (employee.personalEmail = personalEmail);
  isAdmin && (employee.isAdmin = isAdmin);

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    employee.password = hashedPassword;
  }
  mobile && (employee.mobile = mobile);
  role && (employee.role = role);

  if (reporterEmail) {
    const pervReporter = await Employee.findById(employee.reporter);

    pervReporter.reportees = pervReporter.reportees.filter(
      (reportee) => reportee.toString() !== employee._id.toString()
    );

    await pervReporter.save();

    const newReporter = await Employee.findOne({ email: reporterEmail });
    newReporter.reportees.push(employee._id);
    await newReporter.save();

    employee.reporter = newReporter._id;
  }

  const updatedEmployee = await employee.save();

  delete updatedEmployee.password;

  res.status(201).json({
    status: "success",
    data: updatedEmployee,
  });
});

const deleteEmployeeById = asyncHandler(async (req, res, next) => {
  const { employeeId } = req.params;

  await Employee.findByIdAndDelete(employeeId);

  res.status(201).json({
    status: "success",
    data: null,
  });
});

export {
  login,
  logout,
  getReportees,
  updateDetails,
  registerEmployee,
  getApprovals,
  getEmployees, // search by email or name
  getReporteesById,
  getHierarchy, // get self hierarchy
  getHierarchyById, // get the hierarchy of other employees (admin)
  updateEmployeeById,
  approveEmployeeUpdation,
  deleteEmployeeById,
};

/*
// FOR CEO ONLY
const registerEmployee = asyncHandler(async (req, res, next) => {
  const { name, email, personalEmail, password, mobile, role, reporterEmail } =
    req.body;

  if (
    !name ||
    !email ||
    !password ||
    !mobile ||
    !role ||
    (role !== "CEO" && !reporterEmail)
  ) {
    throw new Error("All fields are required.");
  }

  if (!validatePassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long containing at lease one uppercase letter, one lowercase letter, one number and one special character."
    );
  }

  let reporterEmployee = null;
  reporterEmail &&
    (reporterEmployee = await Employee.findOne({ email: reporterEmail }));

  if (role !== "CEO" && !reporterEmployee) {
    throw new Error(`No employee found having email: ${reporterEmail}`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let newEmployeeDetails = {
    name,
    email,
    password: hashedPassword,
    mobile,
    role,
  };

  reporterEmployee &&
    (newEmployeeDetails = {
      ...newEmployeeDetails,
      reporter: reporterEmployee?._id,
    });

  personalEmail &&
    (newEmployeeDetails = { ...newEmployeeDetails, personalEmail });

  const newEmployee = new Employee(newEmployeeDetails);
  reporterEmployee?.reportees.push(newEmployee._id);

  await reporterEmployee?.save();
  await newEmployee.save();

  delete newEmployee.password;

  res.status(201).json({
    status: "success",
    data: newEmployee,
  });
});


const approveEmployeeUpdation = asyncHandler(async (req, res, next) => {
  const { employeeId } = req.params;

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    throw new Error("Employee doesn't exists.");
  }

  const { approved } = req.body;

  const currentApproval = req.employee.userUpdateApprovals.find(
    (data) => data.userDetails.userId.toString() === employeeId.toString()
  );

  if (!currentApproval) {
    throw new Error("No pending approvals.");
  }

  approved
    ? (currentApproval.status = "APPROVED")
    : (currentApproval.status = "REJECTED");

  await req.employee.save();

  if (approved) {
    const { personalEmail, password, mobile } =
      currentApproval.userDetails.updatingEmployeeDetails;
    personalEmail && (employee.personalEmail = personalEmail);
    password && (employee.password = password);
    mobile && (employee.mobile = mobile);

    await employee.save();
  }
  res.status(201).json({
    status: "success",
    data: null,
  });
});
*/
