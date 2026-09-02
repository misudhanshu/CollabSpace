const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      minlength: [5, "Organization name must be at least 5 characters"],
      maxlength: [30, "Organization name cannot exceed 30 characters"],
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
