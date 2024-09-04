import bcrypt from "bcryptjs";
import Employee from "../models/employeeModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import validatePassword from "../utils/validatePassword.js";
import createToken from "../utils/createToken.js";

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

const getReportees = asyncHandler(async (req, res, next) => {
  const reportees = await Employee.findById(req.employee._id, {
    reportees: 1,
  }).populate("reportees");

  res.status(201).json({
    status: "success",
    data: reportees,
  });
});

const updateDetails = asyncHandler(async (req, res, next) => {
  const { personalEmail, password, mobile } = req.body;

  //   personalEmail && (req.employee.personalEmail = personalEmail);
  //   mobile && (req.employee.mobile = mobile);

  //   if (password) {
  //     const salt = await bcrypt.genSalt(10);
  //     const hashedPassword = await bcrypt.hash(password, salt);
  //     req.employee.password = hashedPassword;
  //   }

  //   const updatedEmployee = await req.employee.save();

  //   delete updatedEmployee.password;
  //   res.status(201).json({
  //     status: "success",
  //     data: updatedEmployee,
  //   });

  let updatingEmployeeDetails = {};
  personalEmail &&
    (updatingEmployeeDetails = { ...updatingEmployeeDetails, personalEmail });
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updatingEmployeeDetails = {
      ...updatingEmployeeDetails,
      password: hashedPassword,
    };
  }
  mobile && (updatingEmployeeDetails = { ...updatingEmployeeDetails, mobile });

  const employee = {
    userId: req.employee._id,
    updatingEmployeeDetails,
  };

  const reporter = await Employee.findById(req.employee.reporter);

  reporter.userUpdateApprovals = reporter.userUpdateApprovals.filter(
    (approval) =>
      !(
        approval.userDetails.userId.toString() ===
          req.employee._id.toString() && approval.status === "PENDING"
      )
  );

  reporter.userUpdateApprovals.push({
    userDetails: employee,
  });

  //   console.log(
  //     reporter,
  //     reporter.userUpdateApprovals[0].userDetails,
  //     reporter.userUpdateApprovals[0].userDetails?.updatingEmployeeDetails
  //   );

  await reporter.save();

  res.status(201).json({
    status: "success",
    message: "pending for approval",
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

const deleteEmployeeUpdateApproval = asyncHandler(async (req, res, next) => {
  const { approvalId } = req.params;

  req.employee.userUpdateApprovals = req.employee.userUpdateApprovals.filter(
    (approval) => approval._id.toString() !== approvalId.toString()
  );

  await req.employee.save();

  res.status(201).json({
    status: "success",
    data: null,
    message: "Deleted successfully",
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
  getReportees,
  updateDetails,
  registerEmployee,
  getReporteesById,
  updateEmployeeById,
  approveEmployeeUpdation,
  deleteEmployeeUpdateApproval,
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
*/
