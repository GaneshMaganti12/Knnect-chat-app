import React from "react";
import { useUserChatData } from "../context/ChatContext";
import { fetchPostChatUsers } from "../api/api";
import {
  findUserFromActiveUserArray,
  getToken,
  getUserDetails,
  transformUserChatArray,
} from "../Utils/Utils";
import { useNavigate } from "react-router-dom";

function UsersSearchList() {
  const {
    getSelectedChatUserData,
    usersArray,
    toggleUserList,
    activeUsersArray,
  } = useUserChatData();
  const token = getToken();
  const { userId } = getUserDetails(token);
  const navigate = useNavigate();

  // Function to handle user click. It fetches the data for clicked user, updated the selected chat user data and hide the user search list
  const handleClickUser = async (id) => {
    try {
      const res = await fetchPostChatUsers(id, token);
      const userChatObject = transformUserChatArray(res.data.data);
      getSelectedChatUserData(userChatObject);
      toggleUserList(false);
      navigate(`/chat?id=${userId}&id=${userChatObject.chatId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Conditional rendering based on user search array data */}
      {usersArray.length > 0 ? (
        <ul className="w-full h-full flex flex-col overflow-auto scrollbar-hide">
          {usersArray?.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                handleClickUser(user.id);
              }}
            >
              <div className="relative">
                <img
                  src={user?.pic}
                  alt={user?.name || "User Avatar"}
                  className="size-11 rounded-full"
                />
                {findUserFromActiveUserArray(activeUsersArray, user.id) && (
                  <span className="absolute size-3 rounded-full bottom-0 -right-0.5 bg-green-400 border-2 border-white" />
                )}
              </div>
              <h1 className="text-black">{user.name}</h1>
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-slate-300 font-medium self-start py-8">
          No users found
        </span>
      )}
    </>
  );
}

export default UsersSearchList;
