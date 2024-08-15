const User = require("../Models/UserModel");
const catchAsync = require("../utils/catchAsync");

exports.showTasks = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  //   res.status(200).json({
  //     status: "success",
  //     data: user.tasks,
  //   });
  res.status(200).render("tasks", {
    tasks: user.tasks,
  });
});

exports.addTask = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let newTask;

  if (req.body.task) {
    newTask = { ...req.body.task, addedOn: Date.now() };
    user.tasks.push(newTask);
    newTask.id = user.tasks[user.tasks.length - 1]._id;
    await user.save({ validateBeforeSave: false });
  }
  res.status(200).json({
    status: "success",
    data: newTask,
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let newTask;
  if (req.body.task) {
    user.tasks.forEach((task) => {
      if (task.id === req.params.taskId) {
        task.name = req.body.task.name;
        if (req.body.dueDate) {
          task.dueDate = req.body.task.dueDate;
        }
        newTask = task;
      }
    });

    await user.save({ validateBeforeSave: false });
  }
  res.status(200).json({
    status: "success",
    data: newTask,
  });
});
exports.checkTask = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let newTask;

  user.tasks.forEach((task) => {
    if (task.id === req.params.taskId) {
      task.done = !task.done;
      newTask = task;
    }
  });

  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: newTask,
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.tasks = user.tasks.filter((task) => task.id !== req.params.taskId);
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: null,
  });
});
