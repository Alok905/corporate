/login  =>  post
/logout  =>  post
/reportees =>  get => get logged in employee's reportees
/reportees/hierarchy =>  get => get self reportees hierarchy
/update  =>   put => update logged in employee's details      => { personalEmail, password, mobile }
/approval?status=<self_requested, pending, approved or rejected>   => get   => get the approvals (is nothing is passed then all approvals will be got)
/approval/:approvalId   => put  => to approve/reject any approval


------------- ADMIN ROUTES -------------
/?search=<email or name>   =>  search employee by email or name
/register   => post => register a new employee     => { name, email, personalEmail, password, mobile, role, reporterEmail, isAdmin }
/:employeeId/reportees  => get   => get all the reportees of the employee whose id is mentioned
/update/:employeeId   =>  put   => to update any employee's details whose id is mentioned       =>   { name, email, personalEmail, password, mobile, role, reporterEmail, isAdmin }
/<:employeeId>/reportees/hierarchy    => get  => get the hierarchial representation of reportees of perticular employee   (give "root" in place of employeeId to get the hierarchial representation of CEO)