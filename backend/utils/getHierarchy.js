import Employee from '../models/employeeModel.js'
import asyncHandler from "./asyncHandler.js"

const getHierarchy = asyncHandler(async (employeeId) => {
  const employee = await Employee.findById(employeeId);

  if(employee.reportees.length === 0)
    return employee;

  employee.reportees.forEach((reporteesId, i) => {
    employee.reportees[i] = getHierarchy(reporteesId);
  })
  return employee;
})
