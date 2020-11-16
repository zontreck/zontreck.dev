class SingleTimers {
  static inst = null;
  _timers = [];
  _timerObjects = [];

  static instance() {
    if (SingleTimers.inst == null) {
      SingleTimers.inst = new SingleTimers();
    }
    return this.inst;
  }

  add(item, time, itemName) {
    if (!this._timerObjects.includes(itemName)) {
      this._timers.push(setInterval(item, time));
      this._timerObjects.push(itemName);
      return this._timers.length;
    }
  }

  clear(item) {
    clearInterval(this._timers[item]);
  }
}

export default SingleTimers;
