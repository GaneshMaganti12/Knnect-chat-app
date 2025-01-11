const express = require("express");
const { isAuthorizated } = require("../Middlewares/Auth");
const {
  getChatUsers,
  createUserChat,
  getUsers,
} = require("../Controllers/ChatControllers");
const router = express.Router();

router.get("/users", isAuthorizated, getUsers);
router.get("/chat-users", isAuthorizated, getChatUsers);
router.post("/chat-users/:receiverId", isAuthorizated, createUserChat);

module.exports = router;
