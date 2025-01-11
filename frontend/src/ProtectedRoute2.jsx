import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "./Utils/Utils";

function ProtectedRoute2() {
  const token = getToken();

  // Redirect to /sign-in if token not exists, otherwise show the current route
  return <>{token ? <Outlet /> : <Navigate to={"/sign-in"} />}</>;
}

export default ProtectedRoute2;
