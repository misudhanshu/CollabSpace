const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  creatingTask,
  gettingAllTasks,
} = require("../controllers/tasksControllers");
const router = express.Router({ mergeParams: true });

router.post("/create", authMiddleware, creatingTask);
router.get("/", authMiddleware, gettingAllTasks);

module.exports = router;
