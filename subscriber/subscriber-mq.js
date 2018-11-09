const axios = require('axios');
const config = require('../config');

const BATCH_SIZE = 100;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const simulateProcessing = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, getRandomInt(10, 1501));
  });
};

class Subscriber {
  constructor(name) {
    this.name = name;
    this.messagesHandled = 0;
  }

  async fetchMessage() {
    try {
      const response = await axios.get(`http://${config.REMOTE_HOST}:3000/message?receiver=${this.name}&count=${BATCH_SIZE}`);
      if (response.data.messages) {
        const processable = response.data.messages.filter(m => m);
        this.messagesHandled += processable.length;
        await simulateProcessing();
        return true;
      }
    } catch (e) {}
    return false;
  }

  async start() {
    let messageHandlingStarted = false;
    while (this.messagesHandled < config.SIMULATION_ROUNDS) {
      const response = await this.fetchMessage();
      if (response && !messageHandlingStarted) {
        console.log(`${this.name} started processing messages`);
        messageHandlingStarted = true;
        console.time(this.name);
      }
    }
    console.log(`Done handling ${config.SIMULATION_ROUNDS} purchases`);
    console.log(`${this.name} finished in UNIX time ${new Date().getTime()}`);
    console.timeEnd(this.name);
  }
}

module.exports = { Subscriber };
