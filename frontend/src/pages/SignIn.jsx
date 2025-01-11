import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import Layout from "../components/Layout";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useAuthenticate } from "../hooks/useAuthenticate";

// Using Yup for form validation, checking if the email is valid and required, password required,
const validate = yup.object({
  email: yup.string().email("Invalid Email").required("Required*"),
  password: yup.string().required("Required*"),
});

function SignIn() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(validate),
  });

  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const { isLoading, signInWithEmail, signInWithGoogle } = useAuthenticate();

  useEffect(() => {
    document.title =
      location.pathname === "/sign-in" ? "Sign In | Knnect" : "Knnect";
  }, [location.pathname]);

  // Function to handle Google sign-in using Firebase Authentication
  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  // Function to handle email and password sign-in using Firebase Authentication
  const handleSignIn = (data) => {
    signInWithEmail(data);
    setIsPasswordShow(false);
    reset();
  };

  return (
    <Layout>
      <AuthLayout title={"Sign in to Knnect"}>
        <ToastContainer style={{ fontSize: "13px", marginTop: "50px" }} />
        <button
          className="flex items-center gap-6 border border-slate-300 w-full px-4 py-2 rounded-md"
          onClick={handleGoogleSignIn}
        >
          <img src="/google.svg" className="size-5" />
          Continue with Google
        </button>
        <div className="flex items-center gap-4">
          <hr className="w-full border border-slate-200" />
          <span>or</span>
          <hr className="w-full border border-slate-200" />
        </div>
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <div className="flex flex-col gap-4 mb-1">
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
            <div className="flex flex-col gap-1">
              <div className="border border-slate-300 rounded flex items-center p-2">
                <input
                  type={isPasswordShow ? "text" : "password"}
                  className="outline-none flex-1"
                  placeholder="Enter Password*"
                  name="password"
                  {...register("password")}
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
              {errors.password && (
                <span className="text-red-500 text-xs font-medium">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p
              onClick={() => navigate("/reset-password")}
              className="self-end text-sm cursor-pointer"
            >
              Forget your password?
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-cyan-500 text-white py-2 rounded relative flex justify-center items-center hover:bg-cyan-600 ${
                isLoading &&
                "hover:bg-cyan-400 bg-cyan-400/70 cursor-not-allowed"
              }`}
            >
              {isLoading && (
                <span className="absolute rounded-full size-6 border-2 border-white border-t-transparent animate-spin" />
              )}
              {isLoading ? "Signing In" : "Sign In"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm">
            Don't have an account?
            <button
              onClick={() => navigate("/sign-up")}
              className="ml-2 underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </AuthLayout>
    </Layout>
  );
}

export default SignIn;
