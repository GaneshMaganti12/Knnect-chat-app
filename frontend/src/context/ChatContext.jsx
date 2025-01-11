import { createContext, useContext, useState } from "react";

// Create a context for managing chat data
const chatData = createContext();

// Custom hook to access the chat data context
export const useUserChatData = () => useContext(chatData);

function ChatProvider({ children }) {
  const [userChatArray, setUserChatArray] = useState([]);
  const [usersArray, setUsersArray] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState({});
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [activeUsersArray, setActiveUsersArray] = useState([]);
  const [isTimerOff, setIsTimerOff] = useState(false);

  // Function to get the user chat data array
  const getUserChatData = (data) => {
    setUserChatArray(data);
  };

  // Function to get the user search data array
  const getUsersArrayData = (data) => {
    setUsersArray(data);
  };

  // Function to toggle the visibility of the user search list
  const toggleUserList = () => {
    setIsUserListOpen(!isUserListOpen);
  };

  // Function to get the selected chat user data
  const getSelectedChatUserData = (data = {}) => {
    setSelectedChatUser(data);
  };

  // Function to reset all chat-related data
  const clearAllData = () => {
    setUserChatArray([]);
    setUsersArray([]);
    setSelectedChatUser({});
    setIsUserListOpen(false);
  };

  // Function to toggle the is timer off value.
  const toggleTimerStatus = (value) => {
    setIsTimerOff(value);
  };

  // Function to get the user data.
  const getUserData = (data) => {
    setUserData(data);
  };

  // Function to get the active users data.
  const getActiveUserData = (data) => {
    setActiveUsersArray(data);
  };

  return (
    <chatData.Provider
      value={{
        userChatArray,
        usersArray,
        isUserListOpen,
        selectedChatUser,
        userData,
        isTimerOff,
        activeUsersArray,
        getUserData,
        toggleTimerStatus,
        getActiveUserData,
        clearAllData,
        getSelectedChatUserData,
        getUserChatData,
        getUsersArrayData,
        toggleUserList,
      }}
    >
      {children}
    </chatData.Provider>
  );
}

export default ChatProvider;
