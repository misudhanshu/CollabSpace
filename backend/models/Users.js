const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
    minlength: [5, "Username must be at least 5 characters"],
    maxlength: [15, "Username cannot exceed 15 characters"],
    match: [/^[A-Za-z0-9!@#$%^&*._-]+$/, "Username contains invalid characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [5, "Password must be at least 5 characters"],
  },
});

module.exports = mongoose.model("Users", usersSchema);
