const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 15,
    match: /^[A-Za-z0-9!@#$%^&*._-]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
});

module.exports = mongoose.model("Users", usersSchema);
