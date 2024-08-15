import "@babel/polyfill";
import { login, logout, signup } from "./login";
import { doTask, deleteTask, addTask } from "./taskHandlers";

const logoutBtn = document.querySelector(".logout");
const loginForm = document.querySelector(".form.login");
const signupForm = document.querySelector(".form.signup");
const taskForm = document.querySelector(".taskForm");
const tasks = document.querySelectorAll(".tasks div");

tasks.forEach((task) => {
  task.firstChild.addEventListener("change", (e) => {
    doTask(task.dataset.taskid);
  });
  task.lastElementChild.addEventListener("click", (e) => {
    deleteTask(task.dataset.taskid);
    task.parentElement.removeChild(task);
  });
});

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("confirmPassword").value;
    signup(username, email, password, passwordConfirm);
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (taskForm) {
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = document.getElementById("taskInput").value;
    const taskDate = document.getElementById("taskDate").value;
    if (taskName) {
      addTask({
        name: taskName,
        dueDate: taskDate,
      });
      document.getElementById("taskInput").value = "";
    }
  });
}
