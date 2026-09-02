const Tasks = require("../models/Tasks");

const creatingTask = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, duedate } = req.body;

    if (!title) {
      return res.status(404).json({
        success: false,
        message: `Title is required!`,
      });
    }

    const createNewTask = await Tasks.create({
      title,
      duedate,
      workspace: workspaceId,
    });

    return res.status(201).json({
      success: true,
      message: `Task created successfully`,
      task: createNewTask,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || `Error creating task`,
    });
  }
};

const gettingAllTasks = async (req, res) => {
  try {
    const findAllTasks = await Tasks.find({
      workspace: req.params.workspaceId,
    });

    if (!findAllTasks) {
      res.status(404).json({
        success: false,
        message: `No task found!`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Here are your tasks`,
      findAllTasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error}`,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required!",
      });
    }

    const updatedTask = await Tasks.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true },
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message || error}`,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Tasks.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message || error}`,
    });
  }
};

module.exports = {
  creatingTask,
  gettingAllTasks,
  updateTaskStatus,
  deleteTask,
};
