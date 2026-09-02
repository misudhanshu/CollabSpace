const Workspace = require("../models/Workspace");
const Users = require("../models/Users");
const Organization = require("../models/Organization");

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
    const { organizationId } = req.params;
    const userId = (req.user?.id || req.user?._id)?.toString();

    const organization = await Organization.findById(organizationId);
    const isOwner = organization && organization.owner.toString() === userId;

    let findAllWorkspaces;
    if (isOwner) {
      findAllWorkspaces = await Workspace.find({
        organization: organizationId,
      });
    } else {
      findAllWorkspaces = await Workspace.find({
        organization: organizationId,
        members: userId,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Here are your workspaces`,
      findAllWorkspaces,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
};

const gettingSingleWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    let findTheWorkspace = await Workspace.findById(workspaceId)
      .populate("members", "username")
      .populate({
        path: "organization",
        populate: { path: "owner", select: "username" },
      });

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

const addWorkspaceMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { userId, username } = req.body;

    let targetUser;
    if (userId) {
      targetUser = await Users.findById(userId);
    } else if (username) {
      targetUser = await Users.findOne({ username });
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    let targetWorkspace = await Workspace.findById(workspaceId);
    if (!targetWorkspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found!",
      });
    }

    const isAlreadyMember = targetWorkspace.members.some(
      (id) => id && id.toString() === targetUser._id.toString(),
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this workspace!",
      });
    }

    targetWorkspace.members.push(targetUser._id);
    await targetWorkspace.save();

    const updatedWorkspace = await Workspace.findById(workspaceId)
      .populate("members", "username")
      .populate({
        path: "organization",
        populate: { path: "owner", select: "username" },
      });

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
      workspace: updatedWorkspace,
      findTheWorkspace: updatedWorkspace,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message || error}`,
    });
  }
};

const removeWorkspaceMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    if (!memberId || memberId === "undefined" || memberId === "null") {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    let targetWorkspace = await Workspace.findById(workspaceId);
    if (!targetWorkspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found!",
      });
    }

    // Pull ONLY the specified memberId from members array
    targetWorkspace.members = targetWorkspace.members.filter(
      (id) => id && id.toString() !== memberId.toString(),
    );
    await targetWorkspace.save();

    const updatedWorkspace = await Workspace.findById(workspaceId)
      .populate("members", "username")
      .populate({
        path: "organization",
        populate: { path: "owner", select: "username" },
      });

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      workspace: updatedWorkspace,
      findTheWorkspace: updatedWorkspace,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message || error}`,
    });
  }
};

const getAllRegisteredUsers = async (req, res) => {
  try {
    const users = await Users.find({}, "username");
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message || error}`,
    });
  }
};

const getMyWorkspaces = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    // Find all workspaces where user is in members list
    const userWorkspaces = await Workspace.find({
      members: userId,
    }).populate({
      path: "organization",
      populate: { path: "owner", select: "username" },
    });

    return res.status(200).json({
      success: true,
      message: "User workspaces fetched",
      workspaces: userWorkspaces,
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
  creatingWorkspace,
  gettingAllTheWorkspaces,
  gettingSingleWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
  getAllRegisteredUsers,
  getMyWorkspaces,
};
