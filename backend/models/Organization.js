const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Organization", OrganizationSchema);
