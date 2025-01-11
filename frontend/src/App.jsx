import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Chat from "./pages/Chat";
import ProtectedRoute2 from "./ProtectedRoute2";
import ProtectedRoute1 from "./ProtectedRoute1";
import ChangePassword from "./pages/ChangePassword";
import MyProfile from "./pages/MyProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ProtectedRoute1 handles authentication-related routes (sign-in, sign-up, reset password), */}
        <Route element={<ProtectedRoute1 />}>
          <Route path="/" element={<Navigate to={"/sign-in"} />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ProtectedRoute2 ensures the user is authorized to access the chat page */}
        <Route element={<ProtectedRoute2 />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/my-profile" element={<MyProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
