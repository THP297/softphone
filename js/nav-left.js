export class NavLeft {
  constructor() {
    this.navLeft = document.querySelector("#nav-left");
    this.dropDownStatus = document.querySelector("#dropdown-status");
    this.currentStatus = document.querySelector("#status");
    this.dropDownStatusContent = document.querySelectorAll(
      "#dropdown-status ul li"
    );

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.navLeft.addEventListener("click", () => {
      this.dropDownStatus.style.display = "block";
      this.dropDownStatusContent.forEach((option) => {
        option.addEventListener("click", () => {
          const newStatus = option.querySelector("div");
          this.currentStatus.textContent = newStatus.textContent;
          this.dropDownStatus.style.display = "none";
        });
      });
    });
  }
}
