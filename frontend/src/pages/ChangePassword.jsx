import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AuthLayout from "../components/AuthLayout";
import { ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import {
  checkPasswordValidations,
  getToken,
  getUserDetails,
} from "../Utils/Utils";
import Validation from "../components/Validation";
import { useNavigate } from "react-router-dom";
import { useUserChatData } from "../context/ChatContext";
import { useAuthenticate } from "../hooks/useAuthenticate";

// Using Yup for form validation
// passwords: required field with length (min 6, max 12 characters)
const validate = yup.object({
  currentPassword: yup.string().required("Required*"),
  newPassword: yup
    .string()
    .required("Required*")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*_+?|/(){}.,=])[A-Za-z0-9!@#$%^&*_+?|/(){}.,=]+$/,
      "The Password is invalid"
    )
    .min(6, "Password must be more than 6 characters")
    .max(12, "Password mest be less than 12 characters"),
});

function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { currentPassword: "", newPassword: "" },
    resolver: yupResolver(validate),
  });
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [validations, setValidations] = useState({});
  const newPassword = watch("newPassword");
  const token = getToken();
  const { exp } = getUserDetails(token);
  const currentToken = Date.now() / 1000;
  const navigate = useNavigate();
  const { clearAllData } = useUserChatData();
  const { isLoading, changePassword, signOutUser } = useAuthenticate();

  useEffect(() => {
    document.title =
      location.pathname === `/change-password`
        ? "Change Password | Knnect"
        : "Knnect";
  }, [location.pathname]);

  useEffect(() => {
    const expireToken = exp;
    if (currentToken > expireToken) {
      signOutUser();
      localStorage.removeItem("knnectToken");
      clearAllData();
      navigate("/sign-in");
    }
  }, [currentToken]);

  useEffect(() => {
    setValidations(checkPasswordValidations(newPassword));
  }, [newPassword]);

  // Function to handle the change password form
  const handleChangePassword = (data) => {
    changePassword(data);
    setIsPasswordShow(false);
    reset();
  };

  return (
    <Layout>
      <AuthLayout title={"Change Password"}>
        <ToastContainer style={{ fontSize: "13px", marginTop: "50px" }} />
        <form
          className="flex flex-col space-y-6"
          onSubmit={handleSubmit(handleChangePassword)}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <input
                type="password"
                className="border border-slate-300 rounded outline-none py-2 px-2"
                placeholder="Enter current password*"
                name="currentPassword"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <span className="text-red-500 text-xs font-medium">
                  {errors.currentPassword.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="border border-slate-300 rounded flex items-center p-2">
                <input
                  type={isPasswordShow ? "text" : "password"}
                  className="outline-none flex-1"
                  placeholder="Enter new password*"
                  name="newPassword"
                  {...register("newPassword")}
                />
                <span
                  className="cursor-pointer"
                  onClick={() => setIsPasswordShow(!isPasswordShow)}
                >
                  {isPasswordShow ? (
                    <IoIosEyeOff className="size-5 text-slate-500" />
                  ) : (
                    <IoIosEye className="size-5 text-slate-500" />
                  )}
                </span>
              </div>
              {errors.newPassword && (
                <span className="text-red-500 text-xs font-medium">
                  {errors.newPassword.message}
                </span>
              )}
            </div>
          </div>
          <Validation validations={validations} />
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-cyan-500 text-white py-2 rounded relative flex justify-center items-center hover:bg-cyan-600 ${
              isLoading && "hover:bg-cyan-400 bg-cyan-400/70 cursor-not-allowed"
            }`}
          >
            {isLoading && (
              <span className="absolute rounded-full size-6 border-2 border-white border-t-transparent animate-spin" />
            )}
            {isLoading ? "Changing" : "Change Password"}
          </button>
          <span className="text-xs text-gray-500 font-medium">
            Note: If you are signed in with Google, please go to your{" "}
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              Google Account settings
            </a>{" "}
            to manage your password.
          </span>
        </form>
      </AuthLayout>
    </Layout>
  );
}

export default ChangePassword;
