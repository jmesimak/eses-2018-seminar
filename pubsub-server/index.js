const express = require('express')
const uuid = require('uuid')
const axios = require('axios')
const app = express()
const port = 3000

app.use(express.json());

const subscriptions = {};
const messages = {};

app.post('/subscription', (req, res) => {
  const subscription = req.body;
  console.log(`Subscription request from ${subscription.subscriber}`);
  if (!subscriptions[subscription.topic]) {
    subscriptions[subscription.topic] = [];
  }

  if (!subscriptions[subscription.topic].find(({ name }) => name === subscription.subscriber)) {
    subscriptions[subscription.topic].push({
      name: subscription.subscriber,
      address: subscription.subscriberAddress,
    });
    console.log(`Added subscriber for ${subscription.subscriber}`);
    res.json({ message: 'Subscription received' });
  } else {
    console.log(`Subscription already exists for ${subscription.subscriber}`);
    res.json({ message: 'Subscriber already exists' });
  }

  console.log('subscriptions now:');
  console.log(subscriptions);
});

const handleMessage = async (message, topic) => {
  const allSubscriberCount = message.subscribers.length;
  const deliveries = message.subscribers.map(async subscriber => {
    try {
      await axios.post(subscriber.address, message.content);
      message.subscribers = message.subscribers
        .filter(({ name }) => name !== subscriber.name);
      return true;
    } catch (e) {
      return false;
    }
  });

  const successfulDeliveries = (await Promise.all(deliveries)).filter(delivery => delivery);

  if (successfulDeliveries.length !== allSubscriberCount) {
    messages[topic].push(message);
  }
}

app.post('/message', async (req, res) => {
  const { topic, message } = req.body;

  if (!messages[topic]) messages[topic] = [];
  const wrappedMessage = { content: message, id: uuid.v4(), subscribers: subscriptions[topic] || [] };

  handleMessage(wrappedMessage, topic);
  return res.json({ message: 'ok' })
});

const sendMessages = () => {
  const messagesLeft = Object.keys(messages).reduce((count, topic) => {
    return count + messages[topic].length;
  }, 0);

  if (messagesLeft) {
    Object.keys(messages).forEach(topic => {
      const message = messages[topic].pop();
      if (message) {
        handleMessage(message, topic);
      }
    });
  }

  setTimeout(() => {
    sendMessages();
  }, 10);
}

const printMessages = () => {
  setTimeout(() => {
    const messagesLeft = Object.keys(messages).reduce((count, topic) => {
      return count + messages[topic].length;
    }, 0);
    console.log(`Message count: ${messagesLeft}`);
    printMessages();
  }, 1000*5);
};

// printMessages();
sendMessages();

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
