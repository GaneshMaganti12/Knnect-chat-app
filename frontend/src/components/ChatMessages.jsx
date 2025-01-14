import React, { useEffect, useState } from "react";
import {
  areAllMessagesMoreThanTwoMins,
  filterDeletedMessage,
  findAndUpdateChatArray,
  getToken,
  getUserDetails,
  moveChatToTop,
  pushMesssageObjToArray,
  transformMessageIntoChatData,
  updateMessageArrayData,
  transformChatMessage,
  formatAndSortChatMessages,
  addIsOlderThanTwoMinutesFlag,
  findUserFromActiveUserArray,
  findDeletedMessage,
} from "../Utils/Utils";
import {
  deleteMessage,
  fetchGetChatMessage,
  fetchPostChatMessage,
  patchMessage,
} from "../api/api";
import { useUserChatData } from "../context/ChatContext";
import { ThreeDots } from "react-loader-spinner";
import Modal from "./Modal";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";
import { useSocket } from "../hooks/socket";

function ChatMessages() {
  const token = getToken();
  const { userId } = getUserDetails(token);
  const {
    userChatArray,
    selectedChatUser,
    isTimerOff,
    toggleTimerStatus,
    getUserChatData,
    activeUsersArray,
  } = useUserChatData();
  const { onEvent, emitEvent, offEvent } = useSocket(userId);
  const [userMessageArray, setUserMessageArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [msgInputValue, setMsgInputValue] = useState("");
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState("");
  const [isChatNotFound, setisChatNotFound] = useState(false);

  // Function to create a new message and add it to the user's message array.
  const createNewMessage = async () => {
    try {
      const res = await fetchPostChatMessage(
        token,
        msgInputValue,
        selectedChatUser.chatId
      );
      setUserMessageArray(
        pushMesssageObjToArray(userMessageArray, res.data.data)
      );
      const chatMessagesData = transformChatMessage(res.data.data);
      getUserChatData(
        moveChatToTop(userChatArray, {
          ...selectedChatUser,
          latestMessage: {
            ...selectedChatUser.latestMessage,
            content: chatMessagesData.content,
            createdAt: chatMessagesData.createdAt,
          },
        })
      );
      toggleTimerStatus(true);
      emitEvent("send message", res.data.data);
      const messageIntoChat = transformMessageIntoChatData(
        chatMessagesData,
        userId
      );
      emitEvent("send chat", {
        newChat: messageIntoChat,
        receiver: selectedChatUser,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle updating a message with an emoji based on the provided message ID.
  const handleClickEmoji = async (messageId, emoji = null) => {
    try {
      const res = await patchMessage(token, emoji, messageId);
      setUserMessageArray((prevMessage) =>
        updateMessageArrayData(res.data.data, prevMessage)
      );
      emitEvent("send update", res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle deleting a message from the user's message array based on the provided message ID.
  const handleClickToDelete = async (id) => {
    try {
      const res = await deleteMessage(token, id);
      const updatedMessageArray = filterDeletedMessage(
        userMessageArray,
        res.data.data
      );
      setUserMessageArray(updatedMessageArray);
      emitEvent("send delete message", res.data.data);

      if (areAllMessagesMoreThanTwoMins(updatedMessageArray)) {
        toggleTimerStatus(false);
      }
      const recentMessage =
        updatedMessageArray.length > 0
          ? updatedMessageArray[0].messages[0]
          : findDeletedMessage(userMessageArray, res.data.data);

      getUserChatData(
        findAndUpdateChatArray(
          transformMessageIntoChatData(
            recentMessage,
            selectedChatUser.chatUsers.id
          ),
          userChatArray
        )
      );
      const messageIntoChat = transformMessageIntoChatData(
        recentMessage,
        userId
      );

      emitEvent("send chat", {
        newChat: messageIntoChat,
        receiver: selectedChatUser,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get the user messages.
  const getAllMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetchGetChatMessage(token, selectedChatUser.chatId);
      setUserMessageArray(formatAndSortChatMessages(res.data.data));
    } catch (error) {
      if (error.response.status === 404) {
        setUserMessageArray(formatAndSortChatMessages([]));
        setisChatNotFound(true);
      }
      console.log(error);
    }
    setIsLoading(false);
  };

  // Function to handle the timer logic for updating the message array.
  const handleTimer = () => {
    setUserMessageArray((prevMessages) => {
      const updatedMessageArray = addIsOlderThanTwoMinutesFlag(prevMessages);
      if (areAllMessagesMoreThanTwoMins(updatedMessageArray)) {
        toggleTimerStatus(false);
      }
      return updatedMessageArray;
    });
  };

  useEffect(() => {
    if (isTimerOff) {
      const interval = setInterval(handleTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerOff]);

  useEffect(() => {
    onEvent("receive message", (newMessage) => {
      setUserMessageArray(pushMesssageObjToArray(userMessageArray, newMessage));
    });

    onEvent("receive update", (updateMessage) => {
      setUserMessageArray(
        updateMessageArrayData(updateMessage, userMessageArray)
      );
    });

    onEvent("receive delete message", (deletedMessage) => {
      setUserMessageArray(
        filterDeletedMessage(userMessageArray, deletedMessage)
      );
    });

    return () => {
      offEvent("receive message");
      offEvent("receive update");
      offEvent("receive delete message");
    };
  });

  useEffect(() => {
    if (selectedChatUser.chatId) getAllMessages();
  }, [selectedChatUser.chatId]);

  return (
    <>
      {isLoading ? (
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
      ) : (
        <div className="h-full w-full space-y-4">
          <MessageHeader setIsModalOpen={setIsModalOpen} />
          <div className="h-[90%] w-full bg-slate-200 rounded flex flex-col justify-end px-4 py-2 space-y-3">
            {/* User message list */}
            {isChatNotFound ? (
              <h1 className="text-center my-auto font-bold text-lg text-gray-400">
                User deleted their account
              </h1>
            ) : (
              <MessageList
                userMessageArray={userMessageArray}
                handleClickEmoji={handleClickEmoji}
                handleClickToDelete={handleClickToDelete}
              />
            )}
            {/* Message form */}
            <MessageForm
              msgInputValue={msgInputValue}
              toggleEmojiPicker={toggleEmojiPicker}
              setMsgInputValue={setMsgInputValue}
              createNewMessage={createNewMessage}
              setToggleEmojiPicker={setToggleEmojiPicker}
            />
          </div>
        </div>
      )}
      {/* Modal for displaying the user details */}
      {isModalOpen && (
        <Modal setIsModalOpen={setIsModalOpen}>
          <div className="w-full max-w-sm bg-white rounded p-6 flex flex-col items-center space-y-4 shadow shadow-slate-400">
            <img
              src={selectedChatUser.chatUsers.pic}
              className="size-44 rounded-full"
            />
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-medium text-center">
                {selectedChatUser.chatUsers.name}
              </h1>
              <p className="text-center">{selectedChatUser.chatUsers.email}</p>
              <p className="text-sm text-center">
                Active Status:
                {findUserFromActiveUserArray(
                  activeUsersArray,
                  selectedChatUser.chatUsers.id
                ) ? (
                  <span className="text-green-500 font-medium ml-2">
                    Online
                  </span>
                ) : (
                  <span className="text-gray-500 font-medium ml-2">
                    Offline
                  </span>
                )}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ChatMessages;
