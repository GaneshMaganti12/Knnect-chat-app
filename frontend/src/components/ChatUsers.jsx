import React, { useEffect, useState } from "react";
import { useUserChatData } from "../context/ChatContext";
import { fetchGetChatUsers } from "../api/api";
import {
  checkIfUserExistsInChatArray,
  findUserFromActiveUserArray,
  formatMessageTimestamp,
  getToken,
  getUserDetails,
  moveChatToTop,
  transformUserChatArray,
} from "../Utils/Utils";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/socket";
import { IoMdSearch } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

function ChatUsers() {
  const {
    userChatArray,
    activeUsersArray,
    getUserChatData,
    selectedChatUser,
    getSelectedChatUserData,
  } = useUserChatData();
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const { userId } = getUserDetails(token);
  const navigate = useNavigate();
  const { onEvent, offEvent } = useSocket(userId);
  const [searchUser, setSearchUser] = useState("");
  const [userChatsList, setUserChatsList] = useState([]);

  // function to fetch the user chat data.
  const fetchChatData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchGetChatUsers(token);
      getUserChatData(transformUserChatArray(res.data.data));
    } catch (error) {
      console.log(error.response);
    }
    setIsLoading(false);
  };

  // Function to toggle the active user chat based on the provided user object.
  const toggleActiveChatUser = (user) => {
    const updatedChatData = userChatArray.map((chat) => ({
      ...chat,
      isActive: chat.chatId === user.chatId,
    }));
    getUserChatData(updatedChatData);
    getSelectedChatUserData({ ...user, isActive: true });
    navigate(`/chat?id=${userId}&id=${user.chatId}`);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchUser(value);
    const filteredChats = userChatArray.filter((user) =>
      user.chatUsers.name.toLowerCase().includes(value)
    );
    setUserChatsList(filteredChats);
  };

  useEffect(() => {
    setUserChatsList(userChatArray);
  }, [userChatArray]);

  useEffect(() => {
    if (Object.keys(selectedChatUser).length > 0) {
      const isUserInChat = checkIfUserExistsInChatArray(
        userChatArray,
        selectedChatUser
      );
      if (isUserInChat) {
        getUserChatData(
          userChatArray.map((chat) => ({
            ...chat,
            isActive: chat.chatId === selectedChatUser.chatId,
          }))
        );
      } else {
        getUserChatData([
          selectedChatUser,
          ...userChatArray.map((chat) => ({ ...chat, isActive: false })),
        ]);
      }
    } else {
      fetchChatData();
    }
  }, [selectedChatUser]);

  useEffect(() => {
    onEvent("receive chat", (newChat) => {
      const isUserInChat = checkIfUserExistsInChatArray(userChatArray, newChat);
      if (!isUserInChat) {
        getUserChatData([newChat, ...userChatArray]);
      } else {
        if (
          Object.keys(selectedChatUser).length > 0 &&
          selectedChatUser.chatId === newChat.chatId
        ) {
          getUserChatData(
            moveChatToTop(userChatArray, {
              ...newChat,
              isActive: true,
              latestMessage:
                newChat.latestMessage.content !== ""
                  ? newChat.latestMessage
                  : {},
            })
          );
        } else {
          getUserChatData(moveChatToTop(userChatArray, newChat));
        }
      }
    });

    return () => {
      offEvent("receive chat");
    };
  });

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2 border-2 border-gray-400 rounded-full px-3 py-1">
        <IoMdSearch className="h-6 w-6 text-gray-600" />
        <input
          type="text"
          className="outline-none flex-1"
          placeholder="Search"
          value={searchUser}
          onChange={handleSearch}
        />
        {searchUser && (
          <RxCross1
            className="h-5 w-5 text-gray-600 cursor-pointer"
            onClick={() => {
              setSearchUser("");
              setUserChatsList(userChatArray);
            }}
          />
        )}
      </div>
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <ThreeDots
            visible={true}
            height="40"
            width="40"
            color="#343434"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : userChatsList.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <h1 className="text-md text-slate-300 font-medium">No chat users</h1>
        </div>
      ) : (
        <ul className="flex- flex-col">
          {userChatsList?.map((user) => (
            <li
              key={user.chatId}
              className={`w-full flex items-start gap-4 p-3 ${
                user.isActive ? "lg:bg-cyan-400" : "hover:bg-gray-100"
              }`}
              onClick={() => toggleActiveChatUser(user)}
            >
              <div className="relative size-12">
                <img
                  src={user?.chatUsers?.pic}
                  className="rounded-full size-10"
                  alt={user?.chatUsers?.name || "User Avatar"}
                />
                {findUserFromActiveUserArray(
                  activeUsersArray,
                  user.chatUsers.id
                ) && (
                  <span className="absolute size-3 rounded-full bottom-2 -right-0.5 bg-green-400 border-2 border-white" />
                )}
              </div>

              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <h1 className="line-clamp-1">{user?.chatUsers?.name}</h1>
                  {user?.latestMessage?.createdAt && (
                    <span
                      className={`text-[10px]  ${
                        user.isActive ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {formatMessageTimestamp(user.latestMessage.createdAt)}
                    </span>
                  )}
                </div>
                {user?.latestMessage?.content && (
                  <p
                    className={`text-xs  line-clamp-1 ${
                      user.isActive ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {user.latestMessage.content}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatUsers;
