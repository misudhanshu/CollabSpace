const express = require("express");
const {
  registeringUserInTheDatabase,
  loginUser,
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/register", registeringUserInTheDatabase);
router.post("/login", loginUser);

module.exports = router;
