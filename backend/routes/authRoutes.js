const express = require("express");
const {
  registeringUserInTheDatabase,
  loginUser,
  logoutUser,
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/register", registeringUserInTheDatabase);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
