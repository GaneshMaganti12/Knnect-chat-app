import axios from "axios";
import { fileUploadData } from "../Utils/Utils";

// API function to handle file uploads
export const fileUploadApi = async (file) => {
  if (file.length) {
    const imageURL = fileUploadData(file);

    const res = await axios.post(
      `${import.meta.env.VITE_UPLOAD_BASE_URL}${
        import.meta.env.VITE_CLOUD_NAME
      }/image/upload`,
      imageURL
    );

    return res.data;
  }
};

// API function to handle user sign-up
export const fetchPostSignUp = async (token) => {
  const options = {
    headers: {
      authorization: token,
    },
  };
  return await axios.post("/user/sign-up", {}, options);
};

// API function to handle user sign-in
export const fetchPostSignIn = async (token) => {
  const options = {
    headers: {
      authorization: token,
    },
  };
  return await axios.post("/user/sign-in", {}, options);
};

// API function to handle user forget password
export const fetchPostForgetPassword = async ({ email }) => {
  const data = { email };
  return await axios.post("/user/forget-password", data);
};

// API function to fetch a list of users.
export const fetchGetUsersData = async (token, search = "") => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`/chat/users?search=${search}`, options);
};

// API function to create a new chat or retrieve an existing chat with a user based on the receiver's ID
export const fetchPostChatUsers = async (receiverId, token) => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return await axios.post(`/chat/chat-users/${receiverId}`, {}, options);
};

// API function to fetch all users
export const fetchGetChatUsers = async (token) => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return await axios.get("/chat/chat-users", options);
};

// API function to send a message in a chat for the specified chat Id
export const fetchPostChatMessage = async (token, content, id) => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return await axios.post(`/chat/messages/${id}`, { content }, options);
};

// API function to fetch all messages for the specified chat Id
export const fetchGetChatMessage = async (token, id) => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`/chat/messages/${id}`, options);
};

// API function to update the message with a specified reaction based on message Id
export const patchMessage = async (token, emoji, id) => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const data = {
    react: emoji,
  };
  return await axios.patch(`/chat/messages/${id}`, data, options);
};

// API function to delete the message based on message Id
export const deleteMessage = async (token, id) => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete(`/chat/messages/${id}`, options);
};

// Function to delete the account based on user id.
export const deleteUserAccount = async (token, id) => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete(`/user/delete-user/${id}`, options);
};
