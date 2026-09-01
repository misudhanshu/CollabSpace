const Workspace = require("../models/Workspace");

const creatingWorkspace = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(404).json({
        success: false,
        message: `Title is required`,
      });
    }

    const newWorkspace = await Workspace.create({
      title,
      description,
      organization: organizationId,
    });

    return res.status(201).json({
      success: true,
      message: `Workspace created successfully!`,
      newWorkspace,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error}`,
    });
  }
};

const gettingAllTheWorkspaces = async (req, res) => {
  try {
    const findAllWorkspaces = await Workspace.find({
      organization: req.params.organizationId,
    });

    return res.status(200).json({
      success: true,
      message: `Here are your workspaces`,
      findAllWorkspaces,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const gettingSingleWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const findTheWorkspace = await Workspace.findById(workspaceId);

    if (!findTheWorkspace) {
      return res.status(404).json({
        success: false,
        message: `Workspace not found!`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Workspace found`,
      findTheWorkspace,
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
  creatingWorkspace,
  gettingAllTheWorkspaces,
  gettingSingleWorkspace,
};
