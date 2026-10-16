const express = require("express");
const {
  organizationOwnerOnlyMiddleware,
} = require("../middlewares/ownerMiddleware");
const {
  createOrganization,
  gettingAllOrganizations,
  gettingSingleOrganizations,
  updateOrganization,
  deleteOrganization,
} = require("../controllers/organizationControllers");
const { getMyWorkspaces } = require("../controllers/workspaceControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createOrganization);
router.get("/", authMiddleware, gettingAllOrganizations);
router.get("/my-workspaces", authMiddleware, getMyWorkspaces);
router.get("/:organizationId", authMiddleware, gettingSingleOrganizations);
router.patch(
  "/rename/:organizationId",
  authMiddleware,
  organizationOwnerOnlyMiddleware,
  updateOrganization,
);
router.delete(
  "/delete/:organizationId",
  authMiddleware,
  organizationOwnerOnlyMiddleware,
  deleteOrganization,
);

module.exports = router;
