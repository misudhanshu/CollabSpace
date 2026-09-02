const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  workspaceAccessMiddleware,
  workspaceOwnerOnlyMiddleware,
} = require("../middlewares/ownerMiddleware");
const {
  creatingWorkspace,
  gettingAllTheWorkspaces,
  gettingSingleWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
  getAllRegisteredUsers,
  getMyWorkspaces,
} = require("../controllers/workspaceControllers");

const router = express.Router({ mergeParams: true });

router.get("/user/my-workspaces", authMiddleware, getMyWorkspaces);
router.post("/create", authMiddleware, creatingWorkspace);
router.get("/", authMiddleware, gettingAllTheWorkspaces);
router.get("/:workspaceId", authMiddleware, workspaceAccessMiddleware, gettingSingleWorkspace);
router.post("/:workspaceId/members", authMiddleware, workspaceOwnerOnlyMiddleware, addWorkspaceMember);
router.delete("/:workspaceId/members/:memberId", authMiddleware, workspaceOwnerOnlyMiddleware, removeWorkspaceMember);
router.get("/:workspaceId/all-users", authMiddleware, workspaceOwnerOnlyMiddleware, getAllRegisteredUsers);

module.exports = router;
