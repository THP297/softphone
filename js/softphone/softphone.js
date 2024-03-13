import { PhoneEvent } from "../sipml5.js";
import { CallControl } from "./call-control.js";

export class Softphone {
  constructor() {
    this.dropdownContent = document.querySelector("#dropdown-options");
    this.phoneInput = document.querySelector("#phone-input input");
    this.dropdownBtn = document.getElementById("dropdown-btn");
    this.dropdownOptions = document.querySelectorAll("#dropdown-options ul li");
    this.callBtn = document.querySelector("#call-btn");
    this.hangupBtn = document.querySelector("#hangup-btn");

    this.callControl = new CallControl();
    this.setupDropdown();
    this.setupCallBtn();
    this.setUpHangupBtn();
  }

  setupDropdown() {
    this.dropdownBtn.addEventListener("click", () => {
      this.dropdownContent.style.display = "block";

      this.dropdownBtn.style.borderColor = "rgba(102,102,102,0.8)";
      this.dropdownBtn.style.borderWidth = "2px";

      setTimeout(() => {
        this.dropdownBtn.style.borderColor = "none";
        this.dropdownBtn.style.borderWidth = "0px";
      }, 100);
    });

    this.dropdownOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const countryCode = option.querySelector(".country-code");
        this.dropdownContent.style.display = "none";
        this.phoneInput.value = countryCode.textContent;
        this.phoneInput.focus();
      });
    });
  }

  setupCallBtn() {
    this.callBtn.addEventListener("click", () => {
      this.calling();
      PhoneEvent.MakeCall(this.phoneInput.value);
    });
  }

  setUpHangupBtn() {
    this.hangupBtn.addEventListener("click", () => {
      this.endCall();
    });
  }

  calling() {
    this.callControl.calling();
  }

  inCall() {
    this.callControl.inCall(this.phoneNumber);
  }

  endCall() {
    this.callControl.endCall();
  }

  clientEndCall() {
    this.callControl.clientEndCall();
  }
}
