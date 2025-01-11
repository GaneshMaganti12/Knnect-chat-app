const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "chat",
    },

    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },

    content: {
      type: String,
      required: true,
    },

    react: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Define the 'Message' model based on the 'messageSchema' schema
const Message = mongoose.model("message", messageSchema);

module.exports = Message;
