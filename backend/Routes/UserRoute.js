const express = require("express");
const router = express.Router();
const { verifyToken, isAuthorizated } = require("../Middlewares/Auth");
const {
  userSignUp,
  userSignIn,
  userForgetPassword,
  deleteUser,
} = require("../Controllers/UserControllers");

router.post("/sign-up", verifyToken, userSignUp);
router.post("/sign-in", verifyToken, userSignIn);
router.post("/forget-password", userForgetPassword);
router.delete("/delete-user/:userId", isAuthorizated, deleteUser);

module.exports = router;
