// -------------------------------------------Settings Status dropdown

var navLeft = document.querySelector("#nav-left");
var dropDownStatus = document.querySelector("#dropdown-status");
var currentStatus = document.querySelector("#status");

var dropDownStatusContent = document.querySelectorAll("#dropdown-status ul li");
navLeft.addEventListener("click", function () {
  dropDownStatus.style.display = "block";
  dropDownStatusContent.forEach((option) => {
    option.addEventListener("click", function () {
      const newStatus = this.querySelector("div");
      currentStatus.textContent = newStatus.textContent;
      dropDownStatus.style.display = "none";
    });
  });
});
