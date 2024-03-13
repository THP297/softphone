import { PhoneEvent } from "./sipml5.js";
import { ChangeUI } from "./control-page/change-page.js";

export class Register {
  constructor() {
    this.handleRegister();
  }

  handleRegister() {
    const registerBtn = document.querySelector("#register-btn");
    registerBtn.addEventListener("click", () => {
      const privateIdentity =
        document.getElementById("txtPrivateIdentity").value;
      const publicIdentity = document.getElementById("txtPublicIdentity").value;
      const password = document.getElementById("txtPassword").value;
      const realm = document.getElementById("txtRealm").value;

      PhoneEvent.RegisterByPublicPrivate(
        privateIdentity,
        password,
        realm,
        publicIdentity
      );

      console.log(privateIdentity);

      const changeUI = new ChangeUI();
      changeUI.loadHTMLContent("softphone.html");
    });
  }
}
