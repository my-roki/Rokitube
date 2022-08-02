import "../scss/styles.scss";

const hamburger = document.getElementById("hamburger");
const aside = document.querySelector("aside");
const main = document.querySelector("main");

const marginFold = "96px";
const marginUnfold = "272px";

const handleNavigation = () => {
  aside.classList.toggle("fold");
  if (main.style.marginLeft === marginFold) {
    main.style.marginLeft = marginUnfold;
    window.sessionStorage.setItem("aside", "unfold");
  } else {
    main.style.marginLeft = marginFold;
    window.sessionStorage.setItem("aside", "fold");
  }
};

const handleResize = (event) => {
  // console.log(event);
  const broswerWidth = event.target.innerWidth;
  if (broswerWidth < 1132) {
    aside.classList.add("fold");
    main.style.marginLeft = marginFold;
    window.sessionStorage.setItem("aside", "fold");
  }
};

const savedStatus = sessionStorage.getItem("aside");
if (savedStatus === "fold") {
  aside.classList.add("fold");
  main.style.marginLeft = marginFold;
} else {
  aside.classList.remove("fold");
  main.style.marginLeft = marginUnfold;
}

hamburger.addEventListener("click", handleNavigation);
window.addEventListener("resize", handleResize);
