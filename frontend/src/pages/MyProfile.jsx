import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  findUserFromActiveUserArray,
  getToken,
  getUserDetails,
} from "../Utils/Utils";
import { useUserChatData } from "../context/ChatContext";
import { PiUserCircleLight } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/Firebase";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { useAuthenticate } from "../hooks/useAuthenticate";
import { useSocket } from "../hooks/socket";

function MyProfile() {
  const token = getToken();
  const userDetails = getUserDetails(token);
  const { activeUsersArray, clearAllData, getActiveUserData } =
    useUserChatData();
  const { isLoading, deleteAccount, signOutUser } = useAuthenticate();
  const { emitEvent, onEvent } = useSocket(userDetails.userId);
  const navigate = useNavigate();
  const [passwordErr, setPasswordErr] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [providerId, setProviderId] = useState(null);
  const currentToken = Date.now() / 1000;
  const user = auth.currentUser;

  // Function to delete the account based on user id and delete user from firebase authentication.
  const handleDeleteAccount = () => {
    if (password || providerId) {
      deleteAccount(password, providerId);
      setPassword("");
    } else {
      setPasswordErr(true);
    }
  };

  useEffect(() => {
    const expireToken = userDetails.exp;
    if (currentToken > expireToken) {
      emitEvent("user offline", userDetails.userId);
      signOutUser();
      localStorage.removeItem("knnectToken");
      clearAllData();
      navigate("/sign-in");
    }
  }, [currentToken]);

  useEffect(() => {
    if (user) {
      const getProviderId = user.providerData[0]?.providerId || null;
      setProviderId(getProviderId);
    }
    document.title =
      location.pathname === `/my-profile` ? "My Profile | Knnect" : "Knnect";
  }, [user]);

  useEffect(() => {
    onEvent("active users list", (activeUsers) => {
      getActiveUserData(activeUsers, userDetails.userId);
    });
  }, [userDetails.userId]);

  return (
    <Layout>
      <ToastContainer style={{ fontSize: "13px", marginTop: "50px" }} />
      <div className="h-full w-full flex items-center justify-center">
        <div className="bg-white w-full max-w-md p-5 flex flex-col items-center lg:rounded-md space-y-4">
          <h1 className="text-2xl font-medium">My Profile</h1>
          <div className="flex flex-col items-center w-full space-y-3">
            <img src={userDetails.pic} className="size-52 rounded-full" />
            <p className="text-sm">
              Active Status:
              {findUserFromActiveUserArray(
                activeUsersArray,
                userDetails.userId
              ) ? (
                <span className="text-green-500 font-medium ml-2">Online</span>
              ) : (
                <span className="text-gray-500 font-medium ml-2">Offline</span>
              )}
            </p>
            <div className="flex flex-col gap-2 w-5/6">
              <div className="flex flex-col gap-1">
                <p className="text-sm">Name</p>
                <div className="flex items-center gap-5 px-2 py-1.5 border border-gray-400 rounded">
                  <PiUserCircleLight className="size-6 text-gray-600" />
                  <h1 className="text-center">{userDetails.name}</h1>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm">Email</p>
                <div className="flex items-center gap-5 px-2 py-1.5 border border-gray-400 rounded">
                  <CiMail className="size-6 text-gray-600" />
                  <p className="text-center">{userDetails.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm">Do you want to delete your account?</p>
            <button
              className="bg-red-500 hover:bg-red-600 rounded text-white font-medium text-sm px-3 py-1.5 flex justify-center gap-1"
              onClick={() => setIsModalOpen(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal setIsModalOpen={setIsModalOpen}>
          <div className="w-full max-w-sm bg-white rounded p-6 flex flex-col items-center space-y-2 shadow shadow-slate-400">
            <h1 className="text-xl font-medium">Delete Account</h1>
            <p className="text-sm pb-5">
              Are you sure you want to delete your account?
            </p>
            <div className="flex flex-col gap-2 space-y-2 w-full">
              {providerId === "password" && (
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`border-2 border-gray-300 rounded px-2 py-1.5 ${
                    passwordErr && "border-red-500"
                  }`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordErr(false);
                  }}
                />
              )}
              <div className="flex flex-col space-y-3 text-sm font-medium">
                <button
                  className={`relative w-full bg-red-500 hover:bg-red-600 rounded text-white px-3 py-2 flex justify-center gap-1 ${
                    isLoading && "hover:bg-red-400 cursor-not-allowed"
                  }`}
                  disabled={isLoading}
                  onClick={handleDeleteAccount}
                >
                  {isLoading && (
                    <span className="absolute border-2 border-white border-t-transparent size-5 rounded-full animate-spin" />
                  )}
                  <MdOutlineDeleteOutline className="size-5" />
                  Proceed
                </button>
                <button
                  className="bg-gray-50 px-3 py-2 rounded shadow-sm shadow-gray-500 w-full"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPassword("");
                    setPasswordErr(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}

export default MyProfile;
