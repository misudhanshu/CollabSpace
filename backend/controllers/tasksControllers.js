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
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error}`,
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

module.exports = {
  creatingTask,
  gettingAllTasks,
};
