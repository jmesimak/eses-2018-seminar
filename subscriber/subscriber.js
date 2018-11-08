const express = require('express')
const axios = require('axios');
const config = require('../config');


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
  constructor(name, topic, port) {
    this.name = name;
    this.topic = topic;
    this.port = port;
  }

  start() {
    const app = express()
    app.use(express.json());

    let handledPurchases = 0;
    let timerRunning = false;
    
    const subscribe = async () => {
      const response = await axios.post(config.SUBSCRIBE_ADDRESS, {
        topic: this.topic,
        subscriber: this.name,
        subscriberAddress: `http://${config.HOST}:${this.port}/message`,
      });
      console.log(response.data);
      return response;
    }
    
    subscribe()
      .then(() => {
        app.listen(this.port, () => console.log(`${this.name} listening on port ${this.port}!`))
    
        app.post('/message', async (req, res) => {
          if (!timerRunning) {
            console.log(`${this.name}: First message received, timer starting`);
            console.time(this.name)
            timerRunning = true;
          }
    
          await simulateProcessing();
    
          res.json({ message: 'ok' });
    
          handledPurchases++;
          if (handledPurchases === config.SIMULATION_ROUNDS) {
            console.timeEnd(this.name);
            console.log(`${this.name} finished in UNIX time: ${new Date().getTime()}`);
          }
        });
      });
  }
}

module.exports = { Subscriber };
