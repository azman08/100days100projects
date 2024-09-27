document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Use setInterval to create stars at a regular interval
  setInterval(() => createStar(), 100);

  // Function to create a star
  const createStar = () => {
    const star = document.createElement("div");
    star.classList.add("star");

    // Set the initial position of the star
    const right = Math.random() * 500;
    const top = Math.random() * window.innerHeight;
    star.style.top = `${top}px`;

    body.appendChild(star);

    // Move the star across the screen
    let currentRight = right;
    const runStar = () => {
      if (currentRight >= window.innerWidth) {
        star.remove(); // Remove the star when it moves off-screen
      } else {
        currentRight += 3;
        star.style.right = `${currentRight}px`;
      }
    };

    // Move the star every 10ms
    setInterval(runStar, 10);
  };
});
