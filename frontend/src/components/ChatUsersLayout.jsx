import React, { useCallback, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import ChatUsers from "./ChatUsers";
import { MagnifyingGlass } from "react-loader-spinner";
import UsersSearchList from "./UserSearchList";
import { fetchGetUsersData } from "../api/api";
import { getToken, transformUsersArrayData } from "../Utils/Utils";
import { useUserChatData } from "../context/ChatContext";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineUserAdd } from "react-icons/ai";
import { debounce } from "lodash";

function ChatUsersLayout() {
  const token = getToken();

  const { getUsersArrayData, isUserListOpen, toggleUserList } =
    useUserChatData();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Function to fetch the list of users based on the provided search value.
  const fetchUsersList = async (search) => {
    setIsLoading(true);
    try {
      const res = await fetchGetUsersData(token, search);
      getUsersArrayData(transformUsersArrayData(res.data.data));
    } catch (error) {
      console.log(error.response);
    }
    setIsLoading(false);
  };

  // Function to handle the "Add User" button click to open the user list.
  const handleClickAddUser = async () => {
    toggleUserList();
    fetchUsersList();
    setSearchValue("");
  };

  // Creates a debounced function to fetch the user list based on the search input.
  const debouncedUsers = useCallback(
    debounce((value) => fetchUsersList(value), 500),
    []
  );

  // Function to handle changes in the search input value.
  const handleChangeSearchValue = async (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedUsers(value);
  };

  return (
    <div className="relative h-full w-full lg:w-[50%] bg-white lg:rounded-lg px-6 py-6 overflow-hidden">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-800 font-bold text-2xl">My Chats</h1>
          <button
            className="bg-slate-100 p-2 rounded shadow-sm shadow-slate-400 text-sm font-medium flex items-center gap-1"
            onClick={handleClickAddUser}
          >
            <AiOutlineUserAdd className="size-5" /> Add Users
          </button>
        </div>
        <hr className="border mb-2" />

        {/* sidebar for add the users into chats */}
        <div
          className={`absolute z-10 top-0 left-0 w-full max-w-80 h-full px-4 py-5 bg-white shadow-sm shadow-gray-500 flex flex-col gap-4 ${
            isUserListOpen ? "translate-x-0" : "-translate-x-full"
          } transform transition-transform duration-300 ease-in-out`}
        >
          <button className="self-end">
            <RxCross1
              className="size-6 cursor-pointer"
              onClick={() => {
                toggleUserList();
                setSearchValue("");
              }}
            />
          </button>
          <h1 className="text-xl font-medium">All Users</h1>
          <div className="border-b-2 border-gray-500 rounded-md flex items-center gap-2 px-4 py-1">
            <input
              type="text"
              className="outline-none w-full"
              placeholder="Search"
              onChange={handleChangeSearchValue}
              value={searchValue}
            />
            <IoMdSearch className="size-6 text-slate-500" />
          </div>
          <div className="flex justify-center items-center h-full overflow-hidden">
            {isLoading ? (
              <MagnifyingGlass
                visible={true}
                height="50"
                width="50"
                ariaLabel="magnifying-glass-loading"
                wrapperStyle={{}}
                wrapperClass="magnifying-glass-wrapper"
                glassColor="#c0efff"
                color="#e15b64"
              />
            ) : (
              <UsersSearchList />
            )}
          </div>
        </div>
      </div>

      {/* chat users list */}
      <div className="h-[80%] overflow-auto scrollbar-hide">
        <ChatUsers />
      </div>
    </div>
  );
}

export default ChatUsersLayout;
