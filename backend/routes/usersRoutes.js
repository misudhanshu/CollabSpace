const gettingUserProfile = require("../controllers/userProfileControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");

const router = express.Router();

router.get("/profile", authMiddleware, gettingUserProfile);

module.exports = router;
