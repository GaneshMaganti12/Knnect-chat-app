import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import Layout from "../components/Layout";
import { useAuthenticate } from "../hooks/useAuthenticate";

// Using Yup for form validation. Checking if the email is valid and required
const validate = yup.object({
  email: yup.string().email("Invalid Email").required("Required*"),
});

function ResetPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
    resolver: yupResolver(validate),
  });
  const { isLoading, resetPassword } = useAuthenticate();

  useEffect(() => {
    document.title =
      location.pathname === "/reset-password"
        ? "Reset Password | Knnect"
        : "Knnect";
  }, [location.pathname]);

  // Function to handle forget password form
  const handleSubmitForm = (data) => {
    resetPassword(data);
    reset();
  };

  return (
    <Layout>
      <AuthLayout title={"Reset Password"}>
        <ToastContainer style={{ fontSize: "13px", marginTop: "50px" }} />
        <form
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <div className="flex flex-col gap-1">
            <input
              type="text"
              className="border border-slate-300 rounded outline-none py-2 px-2"
              placeholder="Enter Email*"
              name="email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-xs font-medium">
                {errors.email.message}
              </span>
            )}
          </div>
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
            {isLoading ? "Resetting" : "Reset"}
          </button>
        </form>
      </AuthLayout>
    </Layout>
  );
}

export default ResetPassword;
