import { PageChangeEffect } from "./control-page/page-effect.js";
import { NavLeft } from "./nav-left.js";
import { Softphone } from "./softphone/softphone.js";
class Main {
  listenToPageChange() {
    new PageChangeEffect();
  }

  navLeft() {
    new NavLeft();
  }

  initSoftPhone() {
    new Softphone();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new Main();
  app.listenToPageChange();
  app.navLeft();
  app.initSoftPhone();
});
