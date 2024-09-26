const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task");
const darkModeToggle = document.getElementById("dark-mode-toggle");

document.addEventListener("DOMContentLoaded", loadApp);

addTaskBtn.addEventListener("click", addTask);

darkModeToggle.addEventListener("click", toggleDarkMode);

function loadApp() {
  if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    createTaskElement(task);
  });
}

function addTask() {
  const task = newTaskInput.value;
  if (task.trim() !== "") {
    createTaskElement(task);
    saveTaskToLocalStorage(task);
    newTaskInput.value = "";
  }
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.innerHTML = `${task} <button>Delete</button>`;
  taskList.appendChild(li);

  li.querySelector("button").addEventListener("click", () => {
    li.remove();
    removeTaskFromLocalStorage(task);
  });
}

function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks = tasks.filter((t) => t !== task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.removeItem("dark-mode");
  }
}
