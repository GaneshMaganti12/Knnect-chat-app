const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const Chat = require("../Models/ChatModel");
const Message = require("../Models/MessageModel");

// Controller to get users, excluding the current user, with optional search functionality
exports.getUsers = asyncHandler(async (req, res) => {
  try {
    const userId = req.id;
    const { search } = req.query;
    const query = { _id: { $ne: userId } };
    if (search) {
      query.name = new RegExp(search, "i");
    }

    // It fetches a list of users from the database and returns only their _id, name, email and picture fields
    const usersArray = await User.find(query).select("_id name email picture");
    res.status(200).json({ success: true, data: usersArray });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Controller to create a chat between two users, checking if it already exists before creating a new one
exports.createUserChat = asyncHandler(async (req, res) => {
  try {
    const userId = req.id;
    const { receiverId } = req.params;

    // If the chat already exists, return the existing chat; otherwise, create a new chat and populate user data
    const userChatFound = await Chat.findOne({
      chatUsers: { $all: [userId, receiverId] },
    })
      .populate({
        path: "chatUsers",
        select: "name email picture",
        match: { _id: { $ne: userId } },
      })
      .populate("latestMessage", "content createdAt");

    if (userChatFound) {
      return res.status(200).json({ success: true, data: userChatFound });
    }

    let userChat = await Chat.create({
      chatUsers: [userId, receiverId],
    });

    userChat = await userChat.populate({
      path: "chatUsers",
      select: "name email picture",
      match: { _id: { $ne: userId } },
    });
    res.status(201).json({ success: true, data: userChat });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Controller to fetch all chat users for a given user, ensuring chats without messages are deleted
exports.getChatUsers = asyncHandler(async (req, res) => {
  try {
    const userId = req.id;

    // Fetch all chats where the current user is involved, sorted by the most recent update
    let userChats = await Chat.find({
      chatUsers: { $elemMatch: { $eq: userId } },
    })
      .sort({ updatedAt: -1 })
      .populate({
        path: "chatUsers",
        select: "name email picture",
        match: { _id: { $ne: userId } },
      })
      .populate("latestMessage", "content createdAt");

    // Filter out chats that do not have any messages
    let filteredChats = [];
    for (const chat of userChats) {
      const messages = await Message.find({ chatId: chat._id });

      if (messages.length > 0 && chat.chatUsers.length > 0) {
        filteredChats.push(chat);
      }
    }

    res.status(200).json({ success: true, data: filteredChats });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
