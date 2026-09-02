const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  creatingTask,
  gettingAllTasks,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/tasksControllers");
const {
  workspaceAccessMiddleware,
} = require("../middlewares/ownerMiddleware");
const router = express.Router({ mergeParams: true });

router.post("/create", authMiddleware, workspaceAccessMiddleware, creatingTask);
router.get("/", authMiddleware, workspaceAccessMiddleware, gettingAllTasks);
router.patch("/:taskId/status", authMiddleware, workspaceAccessMiddleware, updateTaskStatus);
router.delete("/:taskId", authMiddleware, workspaceAccessMiddleware, deleteTask);

module.exports = router;
