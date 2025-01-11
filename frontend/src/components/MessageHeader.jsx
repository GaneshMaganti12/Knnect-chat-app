import React from "react";
import { useUserChatData } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import {
  findUserFromActiveUserArray,
  getToken,
  getUserDetails,
} from "../Utils/Utils";
import { IoIosArrowBack } from "react-icons/io";

function MessageHeader({ setIsModalOpen }) {
  const { getSelectedChatUserData, selectedChatUser, activeUsersArray } =
    useUserChatData();
  const navigate = useNavigate();
  const token = getToken();
  const { userId } = getUserDetails(token);

  return (
    <div className="flex items-center gap-2 pl-4 md:pl-0">
      <IoIosArrowBack
        className="lg:hidden size-5 cursor-pointer"
        onClick={() => {
          getSelectedChatUserData();
          navigate(`/chat?id=${userId}`);
        }}
      />
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={selectedChatUser.chatUsers.pic}
            className="size-10 rounded-full cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          {findUserFromActiveUserArray(
            activeUsersArray,
            selectedChatUser.chatUsers.id
          ) && (
            <span className="absolute size-3 rounded-full bottom-0 -right-0.5 bg-green-400 border-2 border-white" />
          )}
        </div>
        <h1 className="font-medium text-gray-800 text-lg">
          {selectedChatUser.chatUsers.name}
        </h1>
      </div>
    </div>
  );
}

export default MessageHeader;
