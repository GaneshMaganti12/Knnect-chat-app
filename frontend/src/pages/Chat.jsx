import React, { useEffect } from "react";
import Layout from "../components/Layout";
import ChatMessagesLayout from "../components/ChatMessagesLayout";
import { useUserChatData } from "../context/ChatContext";
import { getToken, getUserDetails } from "../Utils/Utils";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ChatUsersLayout from "../components/ChatUsersLayout";
import { useMediaQuery } from "react-responsive";
import { useAuthenticate } from "../hooks/useAuthenticate";
import { useSocket } from "../hooks/socket";

function Chat() {
  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  const { selectedChatUser, clearAllData, getActiveUserData } =
    useUserChatData();
  const { signOutUser } = useAuthenticate();
  const token = getToken();
  const decodeToken = jwtDecode(token);
  const { userId } = getUserDetails(token);
  const currentToken = Date.now() / 1000;
  const { emitEvent, onEvent } = useSocket(userId);

  useEffect(() => {
    navigate(`/chat?id=${userId}`);
    document.title = location.pathname === "/chat" ? "Chat | Knnect" : "Knnect";
  }, [userId]);

  // Check if the token has expired and redirect to sign-in if expired
  useEffect(() => {
    const expireToken = decodeToken.exp;
    if (currentToken > expireToken) {
      emitEvent("user offline", userId);
      signOutUser();
      localStorage.removeItem("knnectToken");
      clearAllData();
      navigate("/sign-in");
    }
  }, [currentToken]);

  useEffect(() => {
    onEvent("active users list", (activeUsers) => {
      getActiveUserData(activeUsers, userId);
    });
  });

  return (
    <Layout>
      {/* Conditional rendering based on screen size */}
      {isLargeScreen ? (
        <div className="h-full w-full flex gap-2">
          <ChatUsersLayout />
          <ChatMessagesLayout />
        </div>
      ) : (
        // Conditional rendering based on selected chat user
        <div className="h-full w-full">
          {Object.keys(selectedChatUser).length === 0 ? (
            <ChatUsersLayout />
          ) : (
            <ChatMessagesLayout />
          )}
        </div>
      )}
    </Layout>
  );
}

export default Chat;
