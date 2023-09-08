import _ from "lodash";

class Counter {
  constructor() {
    this.countStats = {};
  }

  /**
   * @param {string} statName
   * @returns {number} count
   * */
  getCount(statName) {
    return this.countStats[statName] || 0;
  }

  /** @param {string} statName */
  incr(statName) {
    if (!this.countStats[statName]) this.countStats[statName] = 0;
    this.countStats[statName]++;
  }

  resetCount(statName) {
    delete this.countStats[statName];
  }

  reset() {
    this.countStats = {};
  }
}

class NodeJsTimer {
  constructor() {
    this.timers = {
      ongoing: {},
      completed: {},
    };
  }

  resetTimer(timerName) {
    delete this.timers.ongoing[timerName];
    delete this.timers.completed[timerName];
  }

  start(timerName) {
    if (this.timers.ongoing[timerName])
      throw new Error(`an ongoing timer exists for ${timerName}`);
    this.timers.ongoing[timerName] = { start: performance.now() };
  }

  end(timerName) {
    const endTime = performance.now();
    if (!this.timers.ongoing[timerName])
      throw new Error(`timer not found ${timerName}`);
    const startTime = this.timers.ongoing[timerName].start;
    delete this.timers.ongoing[timerName];
    if (!this.timers.completed[timerName])
      this.timers.completed[timerName] = [];
    this.timers.completed[timerName].push(endTime - startTime);
  }

  getAverageTimerDuration(timerName) {
    if (!this.timers.completed[timerName])
      throw new Error(`timer not found ${timerName}`);
    return (
      _.sum(this.timers.completed[timerName]) /
      this.timers.completed[timerName].length
    );
  }

  reset() {
    this.timers = {
      ongoing: {},
      completed: {},
    };
  }
}

class StatsCollector {
  constructor() {
    this.counter = new Counter();
    this.timer = new NodeJsTimer();
  }

  reset() {
    this.counter.reset();
    this.timer.reset();
  }
}

const Stats = new StatsCollector();
export default Stats;
