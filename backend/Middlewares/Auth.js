const asyncHandler = require("express-async-handler");
const { auth } = require("../Config/FirebaseConfig");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

// Middleware to verify the token
exports.verifyToken = asyncHandler(async (req, res, next) => {
  try {
    const IdToken = req.headers.authorization;
    // If token is not provided, send unauthorized response
    if (!IdToken) {
      return res
        .status(401)
        .json({ success: false, message: "You're Unauthorized User" });
    }
    // Verify the token using Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(IdToken);
    // Attach the decoded token data to the request object
    req.user = decodedToken;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ success: false, message: "You're Unauthorized User" });
  }
});

// Middleware to check if the user is authorized
exports.isAuthorizated = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    // If token is provided, verify the token using the secret key
    if (token) {
      const jwtToken = token.split(" ");
      const decodedToken = jwt.verify(jwtToken[1], secretKey);
      if (token) {
        // Attach decoded user ID to request object
        req.id = decodedToken.id;
        // Proceed to the next middleware or route handler
        next();
      } else {
        res
          .status(403)
          .json({ success: false, message: "You're  Unauthorized User" });
      }
    } else {
      res
        .status(403)
        .json({ success: false, message: "You're Unauthorized User" });
    }
  } catch (error) {
    if (error.message === "jwt expired") {
      res.status(401).json({ success: false, message: "Token Expired" });
    } else {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Somenthing went wrong, please try again",
      });
    }
  }
});
