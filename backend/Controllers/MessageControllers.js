const Chat = require("../Models/ChatModel");
const Message = require("../Models/MessageModel");
const asyncHandler = require("express-async-handler");

// Controller to create a new message in a chat and update the latest message in the corresponding chat
exports.createUserMessage = asyncHandler(async (req, res) => {
  try {
    const userId = req.id;
    const { content } = req.body;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: true, message: "Chat not found" });
    }

    // Create a new message in the database
    let message = await Message.create({
      chatId: chatId,
      senderId: userId,
      content,
    });

    // Update the corresponding chat's latest message with the new message's Id
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    // Populate the chat and user details for the newly created message
    message = await Message.findById(message._id).populate({
      path: "chatId",
      populate: { path: "chatUsers", select: "_id name email picture" },
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Controller to get all messages of a specific chat
exports.getUserMessages = asyncHandler(async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ success: true, message: "chat not found" });
    }

    // Find all messages associated with the chatId and populate chat and user details
    const allMessages = await Message.find({ chatId }).populate({
      path: "chatId",
      populate: { path: "chatUsers", select: "_id name email picture" },
    });

    res.status(200).json({ success: true, data: allMessages });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Controller to update the message with a specified react based on message Id
exports.updateUserMessage = asyncHandler(async (req, res) => {
  try {
    const { messageId } = req.params;
    const { react } = req.body;

    // Find the message by ID and update it with the new reaction
    let message = await Message.findByIdAndUpdate(
      messageId,
      {
        react,
      },
      { new: true }
    ).populate({
      path: "chatId",
      populate: { path: "chatUsers", select: "_id name email picture" },
    });
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Controller to delete the message based on message Id
exports.deleteUserMessage = asyncHandler(async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId).populate({
      path: "chatId",
      populate: { path: "chatUsers", select: "_id name email picture" },
    });
    if (!message) {
      return res
        .status(404)
        .json({ success: true, message: "Message not found" });
    }
    await Message.deleteOne({ _id: message._id });
    const mostRecentMessage = await Message.findOne({
      chatId: message.chatId,
    }).sort({ createdAt: -1 });

    if (mostRecentMessage) {
      await Chat.findByIdAndUpdate(message.chatId, {
        latestMessage: mostRecentMessage._id,
      });
    }

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
