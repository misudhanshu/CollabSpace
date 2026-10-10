const express = require("express");
const {
  createOrganization,
  gettingAllOrganizations,
  gettingSingleOrganizations,
  updateOrganization,
  deleteOrganization,
} = require("../controllers/organizationControllers");
const { getMyWorkspaces } = require("../controllers/workspaceControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const ownerMiddleware = require("../middlewares/ownerMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createOrganization);
router.get("/", authMiddleware, gettingAllOrganizations);
router.get("/my-workspaces", authMiddleware, getMyWorkspaces);
router.get("/:organizationId", authMiddleware, gettingSingleOrganizations);
router.patch(
  "/rename/:organizationId",
  authMiddleware,
  ownerMiddleware,
  updateOrganization,
);
router.delete(
  "/delete/:organizationId",
  authMiddleware,
  ownerMiddleware,
  deleteOrganization,
);

module.exports = router;
