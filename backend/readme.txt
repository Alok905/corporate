/login  =>  post
/reportees =>  get => get logged in employee's reportees
/update  =>   put => update logged in employee's details
/approval/:employeeId   => put  => to approve/reject employee's details updation
/approval/:approvalId    => delete  => to delete any logs about any update approval request


------------- ADMIN ROUTES -------------
/register   => post => register a new employee
/:employeeId/reportees  => get   => get all the reportees of the employee whose id is mentioned
/update/:employeeId   =>  put   => to update any employee's details whose id is mentioned