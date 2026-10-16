const Organization = require("../models/Organization");

const organizationOwnerOnlyMiddleware = async (req, res, next) => {
  try {
    const { organizationId } = req.params;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required in request parameters",
      });
    }

    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: `Organization not found`,
      });
    }

    const userId = (req.user?.id || req.user?._id)?.toString();
    const isOwner = organization.owner?.toString() === userId;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only the organization owner can perform this operation!",
      });
    }

    req.organization = organization;
    next();
  } catch (error) {
    console.log(`Error: `.error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error}`,
    });
  }
};

module.exports = {
  organizationOwnerOnlyMiddleware,
};
