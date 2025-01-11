import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  googleProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updateProfile,
  signOut,
} from "../config/Firebase";
import {
  deleteUserAccount,
  fetchPostForgetPassword,
  fetchPostSignIn,
  fetchPostSignUp,
} from "../api/api";
import {
  getToken,
  getUserDetails,
  handleError,
  notifyToast,
} from "../Utils/Utils";
import { useUserChatData } from "../context/ChatContext";
import { useSocket } from "./socket";

export function useAuthenticate() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { clearAllData } = useUserChatData();
  const token = getToken();
  const { userId } = getUserDetails(token);
  const { emitEvent } = useSocket(userId);

  // Function to sign up with email and password using Firebase Authentication.
  const signUp = async ({ name, email, password, imageUrl }) => {
    setIsLoading(true);
    try {
      const userInfo = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userInfo.user, {
        displayName: name,
        ...(imageUrl && { photoURL: imageUrl }),
      });
      await userInfo.user.reload();
      const updatedUser = auth.currentUser;
      const token = await updatedUser.getIdToken(true);

      const { data } = await fetchPostSignUp(token);
      localStorage.setItem("knnectToken", data.jwtToken);
      const { userId } = getUserDetails(data.jwtToken);
      navigate(`/chat?id=${userId}`);
    } catch (error) {
      handleError(error.code);
      console.log(error.message);
    }
    setIsLoading(false);
  };

  // Function to sign in with email and password using Firebase Authentication.
  const signInWithEmail = async (data) => {
    setIsLoading(true);
    try {
      const { email, password } = data;
      const res = await signInWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();
      const response = await fetchPostSignIn(token);
      localStorage.setItem("knnectToken", response.data.jwtToken);
      const { userId } = getUserDetails(response.data.jwtToken);
      navigate(`/chat?id=${userId}`);
    } catch (error) {
      handleError(error.code);
      console.log(error.message);
    }
    setIsLoading(false);
  };

  // Function to sign in with Google using Firebase Authentication.
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const token = await res.user.getIdToken();
      const { data } = await fetchPostSignIn(token);
      localStorage.setItem("knnectToken", data.jwtToken);
      const { userId } = getUserDetails(data.jwtToken);
      navigate(`/chat?id=${userId}`);
    } catch (error) {
      handleError(error.code);
      console.log(error.message);
    }
  };

  // Function to reset a password.
  const resetPassword = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetchPostForgetPassword(data);
      notifyToast({ type: "success", message: res.data.message });
    } catch (error) {
      console.error(error.response.data);
      if (error.response.status === 404) {
        notifyToast({ type: "error", message: error.response.data.message });
      }
    }
    setIsLoading(false);
  };

  // Function to change a password.
  const changePassword = async (data) => {
    setIsLoading(true);
    try {
      const { currentPassword, newPassword } = data;
      const user = auth.currentUser;

      // Check if the user is authenticated with Google
      const isGoogleAuth = user.providerData.some(
        (provider) => provider.providerId === "google.com"
      );
      if (isGoogleAuth) {
        notifyToast({
          type: "error",
          message: "Please go to your Google account settings.",
        });
        return;
      }

      const credentials = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credentials);
      await updatePassword(user, newPassword);
      notifyToast({
        type: "success",
        message: "The Password has been updated successfully.",
      });
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        notifyToast({
          type: "error",
          message: "The current password is incorrect.",
        });
      } else {
        handleError(error.code);
      }
      console.log(error.message);
    }
    setIsLoading(false);
  };

  // Function to delete the user account.
  const deleteAccount = async (password, providerId) => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (providerId === "password") {
        const credentials = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credentials);
      } else if (providerId === "google.com") {
        await reauthenticateWithPopup(user, googleProvider);
      }
      await deleteUserAccount(token, userId);
      await deleteUser(user);
      emitEvent("user offline", userId);
      localStorage.removeItem("knnectToken");
      navigate("/sign-in");
      clearAllData();
    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        notifyToast({
          type: "error",
          message: "You're entered wrong password",
        });
      } else if (error.code === "auth/popup-closed-by-user") {
        notifyToast({
          type: "error",
          message: "Reauthentication popup was closed.",
        });
      } else {
        notifyToast({
          type: "error",
          message: "An error occurred. Please try again.",
        });
      }
      console.log(error.message);
    }
    setIsLoading(false);
  };

  // Function to sign out the user from the Firebase
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isLoading,
    signUp,
    signInWithEmail,
    signInWithGoogle,
    resetPassword,
    changePassword,
    deleteAccount,
    signOutUser,
  };
}
