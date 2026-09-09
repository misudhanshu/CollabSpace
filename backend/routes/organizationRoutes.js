const express = require("express");
const {
  createOrganization,
  gettingAllOrganizations,
  gettingSingleOrganizations,
  updateOrganization,
  deleteOrganization,
} = require("../controllers/organizationControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const ownerMiddleware = require("../middlewares/ownerMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createOrganization);
router.get("/", authMiddleware, gettingAllOrganizations);
router.get("/:organizationId", authMiddleware, gettingSingleOrganizations);
router.patch("/rename/:organizationId", authMiddleware, updateOrganization);
router.delete("/delete/:organizationId", authMiddleware, deleteOrganization);

module.exports = router;
