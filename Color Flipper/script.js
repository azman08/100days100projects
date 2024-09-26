const button = document.getElementById("colorBtn");
const value = document.getElementById("colorValue");

button.addEventListener("click", () => {
  const newColor = generateColors();
  document.body.style.backgroundColor = newColor;
  value.textContent = newColor;
});

function generateColors() {
  const hexColors = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    const RI = Math.floor(Math.random() * 16);
    color = color + hexColors[RI];
  }
  return color;
}
