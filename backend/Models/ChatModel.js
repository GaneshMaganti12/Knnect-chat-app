const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    chatUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "message",
    },
  },
  { timestamps: true }
);

// Define the 'Chat' model based on the 'chatSchema' schema
const Chat = mongoose.model("chat", chatSchema);
module.exports = Chat;
