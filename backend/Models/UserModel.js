const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const userSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    picture: {
      type: String,
      default:
        "https://res.cloudinary.com/ganeshmaganti/image/upload/v1735991459/profile-avatar.png",
    },
  },
  { timestamps: true }
);

// Define a method 'generateJwtToken' on the userSchema to generates a JWT token for the user
userSchema.methods.generateJwtToken = function () {
  return jwt.sign(
    { id: this.id, name: this.name, email: this.email, pic: this.picture },
    secretKey,
    { expiresIn: "1h" }
  );
};

// Define the 'User' model based on the 'userSchema' schema
const User = mongoose.model("user", userSchema);
module.exports = User;
