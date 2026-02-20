export const updateBodyClassesAndMeta = (mode) => {
  document.body.classList.toggle("dark-mode", mode === "dark");
  document.body.classList.toggle("light-mode", mode === "light");

  const metaTag = document.querySelector("meta[name='theme-color']");
  if (metaTag) {
    metaTag.setAttribute("content", mode === "dark" ? "#323537" : "#ffffff");
  }
};