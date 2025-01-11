const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("colors");
require("dotenv").config();
const app = express();
const userRoute = require("./Routes/UserRoute");
const chatRoute = require("./Routes/ChatRoute");
const messageRoute = require("./Routes/MessageRoute");
const path = require("path");

const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Function to connect to the MongoDB database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("backend connected to the database".bgCyan);
  } catch (error) {
    console.log(error);
  }
};

connectToDatabase();

// Setup a route handlers for the '/user' and '/chat' path
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/chat", messageRoute);

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}

// Starts the server on the specified port
const server = app.listen(port, () =>
  console.log(`server is running at port ${port}`.white)
);

// Initializes Socket.IO on the server
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", // Allows only requests from this origin
  },
});

const activeUsers = {};

// Event listener for when a user connects to the socket server
io.on("connection", (socket) => {
  // Setup event: user joins their unique room based on their userId
  socket.on("setup", (userId) => {
    console.log("user: " + userId);
    socket.join(userId);
    socket.emit("User connected");
    activeUsers[userId] = socket.id;
    io.emit("active users list", Object.keys(activeUsers));
  });

  // Send message event: send the message to the recipient
  socket.on("send message", (senderMessageReceived) => {
    if (!senderMessageReceived || !senderMessageReceived.chatId) return;
    const receiverUser = senderMessageReceived.chatId.chatUsers.find(
      (user) => user._id !== senderMessageReceived.senderId
    );
    if (!receiverUser) return;
    socket.to(receiverUser._id).emit("receive message", senderMessageReceived);
  });

  // New chat event: Notify the recipient about a new chat
  socket.on("send chat", (newChatData) => {
    const newChat = newChatData.newChat;
    const chatReceiver = newChatData.receiver;
    if (!chatReceiver || !chatReceiver.chatUsers) return;
    const chatReceiverId = chatReceiver.chatUsers.id;
    socket.to(chatReceiverId).emit("receive chat", newChat);
  });

  // Send update event: send the update message to the recipient
  socket.on("send update", (updatedMessage) => {
    const receiverUser = updatedMessage.chatId.chatUsers.find(
      (user) => user._id === updatedMessage.senderId
    );
    if (!receiverUser) console.log("User not found");
    socket.to(receiverUser._id).emit("receive update", updatedMessage);
  });

  // Send delete Message event: send the delete message to the recipient
  socket.on("send delete message", (deleteMessage) => {
    if (!deleteMessage || !deleteMessage.chatId) return;
    const receiverUser = deleteMessage.chatId.chatUsers.find(
      (user) => user._id !== deleteMessage.senderId
    );
    if (!receiverUser) return;
    socket.to(receiverUser._id).emit("receive delete message", deleteMessage);
  });

  // User offline event: send the active user to the recipients
  socket.on("user offline", (userId) => {
    delete activeUsers[userId];
    Object.keys(activeUsers).forEach((user) => {
      socket.to(user).emit("active users list", Object.keys(activeUsers));
    });
  });

  // // When the user disconnects, leave the room based on the userId
  // socket.on("disconnect", () => {
  //   for (let [userId, socketId] of Object.entries(activeUsers)) {
  //     if (socket.id === socketId) delete activeUsers[userId];

  //     socket.to(userId).emit("active users list", Object.keys(activeUsers));
  //   }
  // });
});
