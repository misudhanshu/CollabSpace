const express = require("express");
const Organization = require("../models/Organization");
const Workspace = require("../models/Workspace");

const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id || req.user?._id;

    const newOrganization = await Organization.create({
      name,
      owner: userId,
    });

    res.status(201).json({
      success: true,
      message: `Organization successfully created!`,
      newOrganization,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    console.error("Error: ", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error!`,
    });
  }
};

const gettingAllOrganizations = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const response = await Organization.find({
      owner: userId,
    });

    return res.status(200).json({
      success: true,
      message: `Here are your organizations`,
      response,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error!`,
    });
  }
};

const gettingSingleOrganizations = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = (req.user?.id || req.user?._id)?.toString();

    const findOrganizationInDatabase =
      await Organization.findById(organizationId);

    if (!findOrganizationInDatabase) {
      return res.status(404).json({
        success: false,
        message: `Organization not found!`,
      });
    }

    const isOwner = findOrganizationInDatabase.owner.toString() === userId;
    const isMember = await Workspace.exists({
      organization: organizationId,
      members: userId,
    });

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this organization",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Here is your organization`,
      findOrganizationInDatabase,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Something went wrong!`,
    });
  }
};

const updateOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { name } = req.body;

    const findOrganizationInDatabase =
      await Organization.findById(organizationId);

    if (!findOrganizationInDatabase) {
      return res.status(404).json({
        success: false,
        message: `Organization not found!`,
      });
    }

    if (findOrganizationInDatabase.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized",
      });
    }

    const updateOrganizationName = await Organization.findByIdAndUpdate(
      organizationId,
      { name },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      response: updateOrganizationName,
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
      message: `Internal server error`,
    });
  }
};

const deleteOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const deleteCurrentOrganization =
      await Organization.findByIdAndDelete(organizationId);

    if (!deleteCurrentOrganization) {
      return res.status(404).json({
        success: false,
        message: `Organization not found!`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Organization deleted successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error`,
    });
  }
};

module.exports = {
  createOrganization,
  gettingAllOrganizations,
  gettingSingleOrganizations,
  updateOrganization,
  deleteOrganization,
};
