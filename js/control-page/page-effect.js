import { ChangeUI } from "./change-page.js";

export class PageChangeEffect {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.pageButtons = document.querySelectorAll("#nav-right button");
    this.pageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const htmlFile = button.id.split("-")[0];
        new ChangeUI().loadHTMLContent(`${htmlFile}.html`);
      });
    });
  }
}
