const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const taskController = require("../Controllers/taskController");

router.get("/", authController.protect, taskController.showTasks);
router.post("/", authController.protect, taskController.addTask);
// router.patch("/:taskId", authController.protect, taskController.updateTask);
router.patch("/:taskId", authController.protect, taskController.checkTask);
router.delete("/:taskId", authController.protect, taskController.deleteTask);

module.exports = router;
