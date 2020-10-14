const moment = require('moment');

class SmsTimer {
  static getInstance(key) {
    return new SmsTimer(key);
  }

  constructor(key) {
    this.key = key;
    this.repository = localStorage;
    this.periodInSeconds = 60;
    this.listeners = [];
    this._init();
  }

  update() {
    const endTime = moment().add(this.periodInSeconds, 's').valueOf();
    this.repository.setItem(this.key, endTime);
    if(Number.isInteger(this.timerId)) {
      clearInterval(this.timerId);
    }
    this._init();
  }

  on(event, callback) {
    this.listeners.push({ event, callback });
    this._emit('tick', this.secondsToEnd);
  }

  off(event, callback) {
    const index = this.listeners.findIndex(listener => listener.event === event && callback === callback);
    this.listeners.splice(index, 1);
  }

  _init() {
    this.secondsToEnd = this._getEndTime().diff(moment(), 'seconds');
    this._emit('tick', this.secondsToEnd);

    this.timerId = setInterval(() => {
      if(this.secondsToEnd < 0) {
        clearInterval(this.timerId);
      } else {
        this._emit('tick', this.secondsToEnd);
      }
      this.secondsToEnd--;
    }, 1000);
  }

  _getEndTime() {
    return moment(+this.repository.getItem(this.key));
  }

  _emit(event, value) {
    this.listeners.forEach((listener) => {
      if(listener.event === event && typeof listener.callback === 'function') {
        listener.callback(value);
      }
    });
  }
}

export default SmsTimer;


//usage
this.smsTimer.on('tick', this.onSmsTimerTick);