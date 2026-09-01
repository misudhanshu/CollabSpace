const express = require("express");
const Users = require("../models/Users");

const gettingUserProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found!`,
      });
    }

    return res.status(200).json({
      success: true,
      response: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error`,
    });
  }
};

module.exports = gettingUserProfile;
