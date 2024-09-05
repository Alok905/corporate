import Employee from "../models/employeeModel.js";

const getHierarchialData = async (employeeId) => {
  const employee = await Employee.findById(employeeId, {
    name: 1,
    email: 1,
    role: 1,
    reportees: 1,
  });

  if (employee.reportees.length === 0) return employee;

  employee.reportees = await Promise.all(
    employee.reportees.map(async (emp) => await getHierarchialData(emp._id))
  );

  return employee;
};

export default getHierarchialData;
