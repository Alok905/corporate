import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { info: employee } = useSelector((state) => state.employee);

  return (
    <>
      {employee && employee.isAdmin ? (
        <Outlet />
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default AdminRoute;
