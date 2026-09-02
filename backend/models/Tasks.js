const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    minlength: [3, "Task title must be at least 3 characters"],
    maxlength: [50, "Task title cannot exceed 50 characters"],
    trim: true,
  },
  duedate: {
    type: Date,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "in-review", "done", "completed"],
    default: "todo",
  },
});

module.exports = mongoose.model("Task", taskSchema);
