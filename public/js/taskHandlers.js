import axios from "axios";

export const doTask = async (id) => {
  console.log("ggg");
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://localhost:3000/tasks/${id}`,
    });
    if (res.data.status === "succes") {
      showAlert("success", "Signed up successfuly");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", err.response.data.message);
  }
};

export const deleteTask = async (id) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `http://localhost:3000/tasks/${id}`,
    });
    // if (res.data.status === "succes") {
    //   showAlert("success", "Signed up successfuly");
    //   window.setTimeout(() => {
    //     location.assign("/");
    //   }, 1000);
    // }
  } catch (err) {
    console.log(err.response);
    showAlert("error", err.response.data.message);
  }
};

exports.addTask = async (task) => {
  const newTask = { ...task };
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/tasks",
      data: {
        task: newTask,
      },
    });
    if (res.data.status === "success") {
      const newTask = res.data.data;
      const markup = `
      <div data-taskid="${newTask.id}">
        <input type="checkbox">
        <p>
          <span>${newTask.name}</span>
          
          <span>${`${newTask.dueDate}`.slice(0, 25)}</span>
        </p>
        <button id="remove">x</button></div>
      `;
      const tasksContainer = document.querySelector(".tasks");
      tasksContainer.insertAdjacentHTML("beforeend", markup);
      const task = tasksContainer.lastElementChild;
      task.firstElementChild.addEventListener("change", (e) => {
        doTask(task.dataset.taskid);
      });
      task.lastElementChild.addEventListener("click", (e) => {
        deleteTask(task.dataset.taskid);
        task.parentElement.removeChild(task);
      });
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", err.response.data.message);
  }
};
