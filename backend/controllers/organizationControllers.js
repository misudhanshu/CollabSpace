const express = require("express");
const Organization = require("../models/Organization");

const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;

    const newOrganization = await Organization.create({
      name,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: `Organization successfully created!`,
      newOrganization,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error!`,
    });
  }
};

const gettingAllOrganizations = async (req, res) => {
  try {
    const response = await Organization.find({
      owner: req.user.id,
    });

    if (!response) {
      res.status(404).json({
        success: false,
        message: `No organization found!`,
      });
    }

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

    const findOrganizationInDatabase =
      await Organization.findById(organizationId);

    if (findOrganizationInDatabase.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized",
      });
    }

    if (!findOrganizationInDatabase) {
      return res.status(404).json({
        success: false,
        message: `Organization not found!`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Here is your organizations`,
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
