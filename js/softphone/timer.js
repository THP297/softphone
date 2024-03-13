export class TimerManager {
  static instance = null;
  static timer = null;

  static getInstance() {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager();
    }
    return TimerManager.instance;
  }

  startTimer(callback) {
    if (!TimerManager.timer) {
      TimerManager.timer = setInterval(callback, 1000);
    }
  }

  stopTimer() {
    if (TimerManager.timer) {
      clearInterval(TimerManager.timer);
      TimerManager.timer = null;
    }
  }
}
