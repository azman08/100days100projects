document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle");
  const icon = document.getElementById("icon");

  // Check for saved user preference, if any
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    icon.textContent = "🌜";
  }

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Change the icon based on the current mode
    if (document.body.classList.contains("dark-mode")) {
      icon.textContent = "🌜";
      localStorage.setItem("theme", "dark");
    } else {
      icon.textContent = "🌞";
      localStorage.setItem("theme", "light");
    }
  });
});
