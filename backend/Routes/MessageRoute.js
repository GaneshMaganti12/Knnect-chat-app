const express = require("express");
const { isAuthorizated } = require("../Middlewares/Auth");
const {
  getUserMessages,
  createUserMessage,
  updateUserMessage,
  deleteUserMessage,
} = require("../Controllers/MessageControllers");
const router = express.Router();

router.post("/messages/:chatId", isAuthorizated, createUserMessage);
router.get("/messages/:chatId", isAuthorizated, getUserMessages);
router.patch("/messages/:messageId", isAuthorizated, updateUserMessage);
router.delete("/messages/:messageId", isAuthorizated, deleteUserMessage);

module.exports = router;
