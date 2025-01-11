const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const { sendToUserMail } = require("../Utils/Utils");
const { auth } = require("../Config/FirebaseConfig");
const Chat = require("../Models/ChatModel");
const Message = require("../Models/MessageModel");
require("dotenv").config();

// User SignUp Controller
module.exports.userSignUp = asyncHandler(async (req, res) => {
  try {
    const { uid, name, email, picture } = req.user;
    // Create a new user in the database
    const user = await User.create({ uid, name, email, picture });
    // Set up email details for sending the register mail
    let mailDetails = {
      from: "knnect.app@gmail.com",
      to: user.email,
      subject: "Welcome to Knnect!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #333;">Welcome to <span style="color: #06b6d4;">Knnect</span>!</h2>
          <p>Hello ${name},</p>
          <p>Your account has been successfully created.</p>
          <p style="color: #333;">Start chatting in real-time and connect with your friends instantly!</p>
          <p>Thank you,<br><span style="color: #06b6d4;">Knnect Team</span></p>
        </div>
              `,
    };
    // Send email to the user for register in Knnect
    sendToUserMail(mailDetails);
    const jwtToken = user.generateJwtToken();
    res.status(201).json({ success: true, jwtToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// User SignIn Controller
module.exports.userSignIn = asyncHandler(async (req, res) => {
  try {
    const { uid, name, email, picture } = req.user;
    let user = await User.findOne({ uid });
    // If user does not exist, create a new user
    if (!user) {
      user = await User.create({ uid, name, email, picture });

      let mailDetails = {
        from: "knnect.app@gmail.com",
        to: user.email,
        subject: "Welcome to Knnect!",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #333;">Welcome to <span style="color: #06b6d4;">Knnect</span>!</h2>
            <p>Hello ${user.name},</p>
            <p>Your account has been successfully created.</p>
            <p style="color: #333;">Start chatting in real-time and connect with your friends instantly!</p>
            <p>Thank you,<br><span style="color: #06b6d4;">Knnect Team</span></p>
          </div>
                `,
      };
      // Send email to the user for register in Knnect
      sendToUserMail(mailDetails);
    }
    // Generate JWT token for the authenticated user
    const jwtToken = user.generateJwtToken();
    res.status(200).json({ success: true, jwtToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// User Forgot Password Controller
module.exports.userForgetPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // If user not found, send a 404 response
    if (!user) {
      res.status(404).json({ success: true, message: "User not found." });
    }
    // Generate password reset link for the user
    const resetLink = await auth.generatePasswordResetLink(email);
    // Set up email details for sending the reset link
    let mailDetails = {
      from: "knnect.app@gmail.com",
      to: user.email,
      subject: "Knnect Password Reset Request",
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #333;"><span style="color: #06b6d4;">Knnect</span> Password Reset</h2>
            <p>Hello ${user.name},</p>
            <p>You recently requested to reset your password for your Knnect account. Please click the link below to reset your password:</p>
            <p>
              <a 
                href="${resetLink}" 
                style="background-color: #22d3ee; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
              >
                Reset Password
              </a>
            </p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you,<br><span style="color: #06b6d4;">Knnect Team</span></p>
          </div>
           `,
    };
    // Send email to the user with the reset link
    sendToUserMail(mailDetails);
    res.status(200).json({
      success: true,
      message: "Password reset link sent, check mail.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find(
      { chatUsers: { $elemMatch: { $eq: userId } } },
      "_id"
    );
    for (let chat of chats) {
      await Message.deleteMany({ chatId: chat._id });
    }
    await Chat.deleteMany({ chatUsers: { $elemMatch: { $eq: userId } } });
    const user = await User.findById(userId);
    await user.deleteOne();
    // Set up email details for sending the register mail
    let mailDetails = {
      from: "knnect.app@gmail.com",
      to: user.email,
      subject: "Welcome to Knnect!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #333;">Your Account Has Been Deleted from <span style="color: #06b6d4;">Knnect</span></h2>
          <p>Hello ${user.name},</p>
          <p>Your Knnect account has been successfully deleted as per your request.</p>
          <p>Thank you,<br><span style="color: #06b6d4;">Knnect Team</span></p>
        </div>
              `,
    };
    // Send email to the user for register in Knnect
    sendToUserMail(mailDetails);
    res.status(200).json({
      success: true,
      message: "The user account has been deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
