const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("menu-link");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
