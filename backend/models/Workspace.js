const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Workspace title is required"],
      minlength: [5, "Workspace title must be at least 5 characters"],
      maxlength: [30, "Workspace title cannot exceed 30 characters"],
    },
    description: {
      type: String,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Workspace", WorkspaceSchema);
