import { sipHangUp } from "../sipml5.js";
import { TimerManager } from "./timer.js";

export class CallControl {
  constructor() {
    this.callBtn = document.querySelector("#call-btn");
    this.hangupBtn = document.querySelector("#hangup-btn");
    this.muteBtn = document.querySelector("#mute-btn");
    this.holdBtn = document.querySelector("#hold-btn");

    this.callPanel = document.querySelector("#call-panel");
    this.phoneNumber = document.querySelector("#phone-number");
    this.timeCall = document.querySelector("#timer");
    this.timerManager = TimerManager.getInstance();
  }

  calling() {
    this.callPanel.style.display = "block";
    this.hangupBtn.style.display = "block";
    this.muteBtn.style.display = "block";
    this.holdBtn.style.display = "block";

    this.phoneNumber.textContent = "Calling...";
    this.callBtn.style.display = "none";
  }

  inCall() {
    let time = 0;
    this.timerManager.startTimer(() => {
      time++;
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      this.timeCall.textContent = `${minutes}:${seconds}`;
    });
    this.phoneNumber.textContent = "In Call";
  }

  endCall() {
    this.timerManager.stopTimer();
    sipHangUp();
    this.hangupBtn.style.display = "none";
    this.muteBtn.style.display = "none";
    this.holdBtn.style.display = "none";
    this.phoneNumber.textContent = "Call Ended!";
    this.timeCall.textContent = "0:0";
    setTimeout(() => {
      this.callPanel.style.display = "none";
    }, 1000);
    this.callBtn.style.display = "block";
  }

  clientEndCall() {
    this.timerManager.stopTimer();
    sipHangUp();
    this.hangupBtn.style.display = "none";
    this.muteBtn.style.display = "none";
    this.holdBtn.style.display = "none";
    this.phoneNumber.textContent = "Call Ended!";
    this.timeCall.textContent = "0:0";
    setTimeout(() => {
      this.callPanel.style.display = "none";
    }, 1000);
    this.callBtn.style.display = "block";
  }
}
