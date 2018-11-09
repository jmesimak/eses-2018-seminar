const axios = require('axios');
const config = require('../config');
const { generatePurchase } = require('../purchase-service-pubsub/purchase-gen');

let publishingStarted = false;

const PURCHASE_RECEIVERS = ['billing-service', 'tax-service', 'shipping-service'];

const publishJson = (receiver, msg) => {
  return new Promise(async (resolve) => {
    await axios.post(`http://${config.REMOTE_HOST}:3000/message`, {
      receiver,
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

      if (purchases % 1000 === 0) {
        console.log(`Handled: ${purchases} purchases`);
      }

      PURCHASE_RECEIVERS.forEach(receiver => {
        publishJson(receiver, generatePurchase());
      });
      publishPurchases();
    }, 5);
  }
};

publishPurchases();
