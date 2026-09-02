const Workspace = require("../models/Workspace");

// Middleware to allow workspace access to both owner and members
const workspaceAccessMiddleware = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      return next();
    }

    const workspace = await Workspace.findById(workspaceId).populate(
      "organization",
    );

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const userId = (req.user?.id || req.user?._id)?.toString();
    const orgOwnerId = workspace.organization?.owner?.toString();
    const isMember = workspace.members?.some(
      (id) => id && id.toString() === userId,
    );
    const isOwner = orgOwnerId === userId;

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to perform this operation on this workspace!",
      });
    }

    req.workspace = workspace;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message || error}`,
    });
  }
};

// Middleware to restrict operation strictly to workspace/organization owner
const workspaceOwnerOnlyMiddleware = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      return next();
    }

    const workspace = await Workspace.findById(workspaceId).populate(
      "organization",
    );

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const userId = (req.user?.id || req.user?._id)?.toString();
    const orgOwnerId = workspace.organization?.owner?.toString();
    const isOwner = orgOwnerId === userId;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only the workspace owner can perform this operation!",
      });
    }

    req.workspace = workspace;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message || error}`,
    });
  }
};

module.exports = {
  workspaceAccessMiddleware,
  workspaceOwnerOnlyMiddleware,
  ownerMiddleware: workspaceOwnerOnlyMiddleware,
};
