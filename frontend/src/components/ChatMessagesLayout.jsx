import React from "react";
import { useUserChatData } from "../context/ChatContext";
import ChatMessages from "./ChatMessages";

function ChatMessagesLayout() {
  const { selectedChatUser } = useUserChatData();

  return (
    <div className="h-full w-full bg-white lg:rounded-lg pt-4 md:p-4 overflow-hidden">
      <div className="h-full w-full flex items-center justify-center">
        {/* Conditional rendering based on selected chat user data */}
        {Object.keys(selectedChatUser).length === 0 ? (
          <span className="font-medium text-slate-300">
            Tap on a chat to start conversation
          </span>
        ) : (
          <ChatMessages />
        )}
      </div>
    </div>
  );
}

export default ChatMessagesLayout;
