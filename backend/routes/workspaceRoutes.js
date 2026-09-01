const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  creatingWorkspace,
  gettingAllTheWorkspaces,
  gettingSingleWorkspace,
} = require("../controllers/workspaceControllers");

const router = express.Router({ mergeParams: true });

router.post("/create", authMiddleware, creatingWorkspace);
router.get("/", authMiddleware, gettingAllTheWorkspaces);
router.get("/:workspaceId", authMiddleware, gettingSingleWorkspace);

module.exports = router;
