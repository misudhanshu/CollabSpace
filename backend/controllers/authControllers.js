require("dotenv").config();
const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registeringUserInTheDatabase = async (req, res) => {
  try {
    const { username, password, gender } = req.body;

    const isUsernameExists = await Users.findOne({ username });

    if (isUsernameExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createNewUser = await Users.create({
      username,
      password: hashedPassword,
      gender,
    });

    if (!createNewUser) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong!",
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully!",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const isUsernameExists = await Users.findOne({ username });

    if (!isUsernameExists) {
      return res.status(400).json({
        success: false,
        message: `User doesn't exists!`,
      });
    }

    const matchPassword = await bcrypt.compare(
      password,
      isUsernameExists.password,
    );

    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: `Invalid credentials!`,
      });
    }

    const accessToken = jwt.sign(
      { id: isUsernameExists._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5m" },
    );

    const refreshToken = jwt.sign(
      { userId: isUsernameExists._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: `User logged in successfully!`,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registeringUserInTheDatabase,
  loginUser,
};
