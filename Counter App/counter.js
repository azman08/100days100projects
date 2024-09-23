const counterValue = document.getElementById("span");
const addButton = document.getElementById("add");
const resetButton = document.getElementById("reset");
const subButton = document.getElementById("sub");

let count = 0;

addButton.addEventListener("click", () => {
  count++;
  counterValue.textContent = count;
});

subButton.addEventListener("click", () => {
  count--;
  counterValue.textContent = count;
});

resetButton.addEventListener("click", () => {
  count = 0;
  counterValue.textContent = count;
});
