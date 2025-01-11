import { jwtDecode } from "jwt-decode";
import { Slide, toast } from "react-toastify";

// Function to get the token stored in local storage.
export const getToken = () => {
  return localStorage.getItem("knnectToken");
};

// Function to get the user id from a decode token.
export const getUserDetails = (token) => {
  const { id, name, email, pic, exp } = token ? jwtDecode(token) : {};
  return { userId: id, name, email, pic, exp };
};

// Function to display different types of toast notifications based on parameters.
export const notifyToast = ({
  type = "default",
  message = "No Message",
  position = "top-right",
  autoClose = 2000,
}) => {
  const toastType = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
    default: toast,
  };
  return toastType[type](message, {
    position: position,
    autoClose: autoClose,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
  });
};

// Function to handle different authentication errors and display relevant error messages using notifyToast.
export const handleError = (error) => {
  switch (error) {
    case "auth/invalid-credential":
      notifyToast({
        type: "error",
        message: "Invalid credentials. Please try again.",
      });
      break;
    case "auth/user-not-found":
      notifyToast({
        type: "error",
        message: "User does not exist. Please sign up",
      });
      break;
    case "auth/wrong-password":
      notifyToast({
        type: "error",
        message: "Incorrect password. Please try again.",
      });
      break;
    case "auth/cancelled-popup-request":
      notifyToast({
        type: "error",
        message: "Popup closed before authentication was completed.",
      });
      break;
    case "auth/popup-closed-by-user":
      notifyToast({
        type: "error",
        message: "You closed the popup without completing sign-in.",
      });
      break;
    case "auth/network-request-failed":
      notifyToast({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
      break;
    case "auth/email-already-in-use":
      notifyToast({
        type: "error",
        message: "User already signed up, Please Sign in.",
      });
      break;
    case "auth/weak-password":
      notifyToast({
        type: "error",
        message:
          "The new password is too weak. Please choose a stronger password.",
      });
      break;
    case "auth/too-many-requests":
      notifyToast({
        type: "error",
        message: "Too many attempts. Please try again later.",
      });
      break;
    default:
      notifyToast({
        type: "error",
        message: "An error occurred. Please try again.",
      });
  }
};

// Function to check the validity of a password.
export const checkPasswordValidations = (value) => {
  let validate = {};

  const upperRegex = /(?=.*[A-Z])[A-Z]+/;
  const lowerRegex = /(?=.*[a-z])[a-z]+/;
  const numberRegex = /(?=.*[0-9])[0-9]+/;
  const symbolRegex = /(?=.*[!@#$%^&*_+?|/(){}.,=])[!@#$%^&*_+?|/(){}.,=]+/;

  if (upperRegex.test(value)) validate.upper = true;
  if (lowerRegex.test(value)) validate.lower = true;
  if (numberRegex.test(value)) validate.number = true;
  if (symbolRegex.test(value)) validate.symbol = true;

  return validate;
};

// Function to prepare a file data for upload.
export const fileUploadData = (file) => {
  const data = new FormData();
  data.append("file", file[0]);
  data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
  data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

  return data;
};

// Function to transform the user chat array data into a specific format.
export const transformUserChatArray = (data) => {
  // If the data is an array, map through each chat and transform the structure.
  if (Array.isArray(data)) {
    return data.map((chat) => {
      return {
        chatId: chat._id,
        chatUsers: {
          id: chat.chatUsers[0]?._id,
          name: chat.chatUsers[0]?.name,
          email: chat.chatUsers[0]?.email,
          pic: chat.chatUsers[0]?.picture,
        },
        ...(chat.latestMessage
          ? {
              latestMessage: {
                content: chat.latestMessage.content,
                createdAt: chat.latestMessage.createdAt,
              },
            }
          : { latestMessage: null }),
        isActive: false,
      };
    });
  }

  // If the data is an object, the data transform the structure.
  return {
    chatId: data._id,
    chatUsers: {
      id: data.chatUsers[0]?._id,
      name: data.chatUsers[0]?.name,
      email: data.chatUsers[0]?.email,
      pic: data.chatUsers[0]?.picture,
    },
    ...(data.latestMessage
      ? {
          latestMessage: {
            content: data.latestMessage.content,
            createdAt: data.latestMessage.createdAt,
          },
        }
      : { latestMessage: null }),
    isActive: true,
  };
};

// Function to transform and sort the user search array data into specific format.
export const transformUsersArrayData = (data) => {
  return data
    .map((item) => {
      return {
        id: item._id,
        name: item.name,
        email: item.email,
        pic: item.picture,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Function to check if the user exist in the chat array.
export const checkIfUserExistsInChatArray = (arr, obj) => {
  return arr.some((chat) => chat.chatId === obj.chatId);
};

// Function to transform the message object.
export const transformChatMessage = (data) => {
  return {
    chatId: data.chatId._id,
    chatUsers: data.chatId.chatUsers.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      pic: user.picture,
    })),
    messageId: data._id,
    content: data.content,
    senderId: data.senderId,
    reacted: data.react,
    createdAt: data.createdAt,
  };
};

// Function to transform and sort the chat messages data into specific format.
export const formatAndSortChatMessages = (data) => {
  // If the data is an array, map through each message and transform the structure, sort the message based on createdAt.
  if (Array.isArray(data)) {
    const messagesObject = data.reduce((obj, message) => {
      const date = new Date(message.createdAt).toDateString();
      const transformMessage = addIsOlderThanTwoMinutesFlag(
        transformChatMessage(message)
      );
      if (!obj[date]) {
        obj[date] = [transformMessage];
      } else {
        obj[date].push(transformMessage);
      }
      return obj;
    }, {});

    return Object.entries(messagesObject)
      .map(([date, array]) => {
        return {
          date: date,
          messages: array.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // If the data is a single message object
  return {
    date: new Date(data.createdAt).toDateString(),
    messages: [addIsOlderThanTwoMinutesFlag(transformChatMessage(data))],
  };
};

// Function to push the message obj to message array based on date.
export const pushMesssageObjToArray = (array, obj) => {
  const date = new Date(obj.createdAt).toDateString();
  const isDateObjInArray = array.some((message) => message.date === date);

  if (!isDateObjInArray) {
    return [formatAndSortChatMessages(obj), ...array];
  }
  return array.map((message) => {
    if (message.date === date) {
      return {
        ...message,
        messages: [
          addIsOlderThanTwoMinutesFlag(transformChatMessage(obj)),
          ...message.messages,
        ],
      };
    }
    return message;
  });
};

// Function to transform message into chat data.
export const transformMessageIntoChatData = (obj, userId) => {
  const chatReceiver = obj.chatUsers.filter((user) => user.id === userId);
  return {
    chatId: obj.chatId,
    chatUsers: {
      id: chatReceiver[0].id,
      name: chatReceiver[0].name,
      email: chatReceiver[0].email,
      pic: chatReceiver[0].pic,
    },
    latestMessage: { content: obj.content, createdAt: obj.createdAt },
    isActive: false,
  };
};

// Function to move a chat object data to the top of the chat data array.
export const moveChatToTop = (array, chatObj) => {
  const filteredArr = array.filter((chat) => chat.chatId !== chatObj.chatId);
  if (chatObj.latestMessage.content !== "") {
    return [chatObj, ...filteredArr];
  }
  return filteredArr;
};

// Function to format the time for a date.
export const extractTime = (date) => {
  const time = new Date(date);
  let hours = time.getHours();
  const minutes = time.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

// Function to format the time for a message timestamp.
export const formatMessageTimestamp = (timestamp) => {
  const currentTime = new Date();
  const messageTime = new Date(timestamp);

  const currentDate = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate()
  );
  const messageDate = new Date(
    messageTime.getFullYear(),
    messageTime.getMonth(),
    messageTime.getDate()
  );
  const differInDays = Math.floor(
    (currentDate - messageDate) / (1000 * 60 * 60 * 24)
  );

  if (differInDays === 0) {
    return "Today";
  } else if (differInDays === 1) {
    return "Yesterday";
  } else {
    const date = messageTime.toLocaleDateString().split("/");
    return `${date[1].length > 9 ? date[1] : `0${date[1]}`}/${
      date[0].length > 9 ? date[0] : `0${date[0]}`
    }/${date[2]}`;
  }
};

// Function to update an message object within message array based on a matching messageId.
export const updateMessageArrayData = (obj, array) => {
  const date = new Date(obj.createdAt).toDateString();
  const isDateObjInArray = array.some((message) => message.date === date);
  const transformMessageObj = transformChatMessage(obj);
  if (!isDateObjInArray) {
    return array;
  }
  return array.map((item) => {
    if (item.date === date) {
      return {
        ...item,
        messages: item.messages.map((msg) => {
          if (msg.messageId === transformMessageObj.messageId) {
            return { ...msg, ...transformMessageObj };
          }
          return msg;
        }),
      };
    }
    return item;
  });
};

// Function to check if a given message created time is at least 2 minutes older than the current time.
export const diffInMins = (time) => {
  const currentTime = new Date();
  const messageTime = new Date(time);
  const diffTime = currentTime - messageTime;
  const diffInMins = Math.floor(diffTime / (1000 * 60));
  return diffInMins >= 2;
};

// Function to check if messages in the array are more than two minutes old.
export const addIsOlderThanTwoMinutesFlag = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      return {
        ...item,
        messages: item.messages.map((message) => {
          return {
            ...message,
            isOlderThanTwoMin: diffInMins(message.createdAt),
          };
        }),
      };
    });
  }

  // If the data is an object, check if message are more than two minutes old.
  return {
    ...data,
    isOlderThanTwoMin: diffInMins(data.createdAt),
  };
};

// Function to filter the delete message from the message array.
export const filterDeletedMessage = (array, obj) => {
  const date = new Date(obj.createdAt).toDateString();
  return array
    .map((message) => {
      if (message.date === date) {
        return {
          ...message,
          messages: message.messages.filter((msg) => msg.messageId !== obj._id),
        };
      }
      return message;
    })
    .filter((message) => message.messages.length > 0);
};

// Function to check all messages in the array are older than two minutes.
export const areAllMessagesMoreThanTwoMins = (array) => {
  return array.every((message) => {
    return message.messages.every((msg) => msg.isOlderThanTwoMin);
  });
};

// Function to find the chat and update with new chat Obj
export const findAndUpdateChatArray = (newChatObj, chatArray) => {
  return chatArray.map((chat) => {
    if (chat.chatId === newChatObj.chatId) {
      return {
        ...chat,
        latestMessage:
          newChatObj.latestMessage.content !== ""
            ? newChatObj.latestMessage
            : {},
      };
    }
    return chat;
  });
};

// Function to find the user from active users array by user id.
export const findUserFromActiveUserArray = (array, id) => {
  return array.some((userId) => userId === id);
};

// Function to extract date from date string.
export const extractDate = (date) => {
  const extractedDate = date.split(" ");
  return `${extractedDate[2]} ${extractedDate[1]} ${extractedDate[3]}`;
};

// Function to find a delete message from message array based on message ID.
export const findDeletedMessage = (array, obj) => {
  return array.map((item) => {
    const deleteMessage = item.messages.find(
      (message) => message.messageId === obj._id
    );
    return {
      ...deleteMessage,
      content: "",
    };
  })[0];
};
