import { NavLeft } from "../nav-left.js";
import { Softphone } from "../softphone/softphone.js";
import { Register } from "../register.js";
import { PageChangeEffect } from "./page-effect.js";

export class ChangeUI {
  loadHTMLContent(filePath) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          let htmlContent = xhr.responseText;
          document.body.innerHTML = htmlContent;

          // *********************** NEW INITIALIZATION ***********************
          new PageChangeEffect();
          new NavLeft();
          {
            filePath === "softphone.html" ? new Softphone() : new Register();
          }
        } else {
          console.error("Failed to load HTML content: " + xhr.status);
        }
      }
    };
    xhr.open("GET", filePath, true);
    xhr.send();
  }
}
