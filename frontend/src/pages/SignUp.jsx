import React, { useEffect, useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fileUploadApi } from "../api/api";
import { checkPasswordValidations, notifyToast } from "../Utils/Utils";
import AuthLayout from "../components/AuthLayout";
import Layout from "../components/Layout";
import Validation from "../components/Validation";
import { useAuthenticate } from "../hooks/useAuthenticate";

// Using Yup for form validation
// name: required field
// email: required field with email format validation
// password: required field with length (min 6, max 12 characters)
const validate = yup.object({
  name: yup.string().required("Required*"),
  email: yup.string().required("Required*").email("Invalid Email"),
  password: yup
    .string()
    .required("Required*")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*_+?|/(){}.,=])[A-Za-z0-9!@#$%^&*_+?|/(){}.,=]+$/,
      "The Password is invalid"
    )
    .min(6, "Password must be more than 6 characters")
    .max(12, "Password mest be less than 12 characters"),
});

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", name: "", password: "" },
    resolver: yupResolver(validate),
  });
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadErr, setUploadErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState({});
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const password = watch("password");

  const { signUp, isLoading } = useAuthenticate();

  // Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files;

    if (!file[0]) return;
    if (!["image/jpeg", "image/png"].includes(file[0].type)) {
      setUploadErr("Unsupported file type.");
      return;
    }
    if (file[0].size > 2 * 1024 * 1024) {
      setUploadErr("File size exceeds 2MB.");
      return;
    }
    setUploadErr("");
    setLoading(true);
    try {
      const imageData = await fileUploadApi(file);
      setImageUrl(imageData?.url);
      notifyToast({
        type: "success",
        message: "Image uploaded successfully",
      });
    } catch (error) {
      notifyToast({ type: "error", message: "Failed to upload image." });
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.title =
      location.pathname === "/sign-up" ? "Sign Up | Knnect" : "Knnect";
  }, [location.pathname]);

  useEffect(() => {
    setValidations(checkPasswordValidations(password));
  }, [password]);

  // Function to handle email and password sign-up.
  const handleSignUp = ({ email, password, name }) => {
    if (uploadErr) {
      return;
    }
    signUp({ email, password, name, imageUrl });
    setIsPasswordShow(false);
    reset();
    setImageUrl(null);
    setIsPasswordFocus(false);
  };

  return (
    <Layout>
      <AuthLayout title={"Sign up to Knnect"}>
        <ToastContainer style={{ fontSize: "13px", marginTop: "50px" }} />
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <div className="flex flex-col gap-3 mb-1">
            <div className="flex flex-col gap-1">
              <input
                type="text"
                className="border border-slate-300 rounded outline-none p-2"
                placeholder="Enter Full Name*"
                name="name"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-xs font-medium">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                className="border border-slate-300 rounded outline-none p-2"
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
                  onFocus={() => setIsPasswordFocus(true)}
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
            {isPasswordFocus && <Validation validations={validations} />}
            <div className="flex flex-col gap-1">
              <input
                type="file"
                accept="image.jpeg, image.png"
                className="border border-slate-300 rounded outline-none p-2 text-sm"
                name="file"
                onChange={handleImageUpload}
              />
              {uploadErr && (
                <span className="text-red-500 text-xs font-medium">
                  {uploadErr}
                </span>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || loading}
            className={`bg-cyan-500 text-white py-2 rounded relative flex justify-center items-center hover:bg-cyan-600 ${
              (isLoading || loading) &&
              "hover:bg-cyan-400 bg-cyan-400/70 cursor-not-allowed"
            }`}
          >
            {(isLoading || loading) && (
              <span className="absolute rounded-full size-6 border-2 border-white border-t-transparent animate-spin" />
            )}
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm">
            Already have account?
            <button
              className="ml-2 underline"
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </button>
          </p>
        </div>
      </AuthLayout>
    </Layout>
  );
}

export default SignUp;
