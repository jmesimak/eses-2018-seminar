const axios = require('axios');
const config = require('../config');
const { generatePurchase } = require('./purchase-gen');

let publishingStarted = false;

const publishJson = (channel, msg) => {
  return new Promise(async (resolve) => {
    await axios.post(`http://${config.REMOTE_HOST}:3000/message`, {
      topic: channel,
      message: msg,
    });
    resolve();
  });
};1

let purchases = 0;

const publishPurchases = () => {
  if (purchases === config.SIMULATION_ROUNDS) {
    console.log('All purchases published');
    console.log(`Ended sending message at UNIX time: ${new Date().getTime()}`);
  }
  if (!publishingStarted) {
    publishingStarted = true;
    console.log(`Started sending message at UNIX time: ${new Date().getTime()}`);
  }
  if (purchases < config.SIMULATION_ROUNDS) {
    setTimeout(() => {
      purchases++;
      publishJson('purchase', generatePurchase());
      publishPurchases();
    }, 5);
  }
};

publishPurchases();
