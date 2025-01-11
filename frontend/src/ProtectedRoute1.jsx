import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUserDetails } from "./Utils/Utils";

function ProtectedRoute1() {
  const token = getToken();
  const { userId } = getUserDetails(token);

  // Redirect to /chat if token exists, otherwise show the current route
  return <>{token ? <Navigate to={`/chat?id=${userId}`} /> : <Outlet />}</>;
}

export default ProtectedRoute1;
