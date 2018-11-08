const express = require('express')
const uuid = require('uuid')
const axios = require('axios')
const app = express()
const port = 3000

app.use(express.json());

const subscriptions = {};
const messages = {};

app.post('/subscription', (req, res) => {
  console.log('Received subscription!');
  const subscription = req.body;
  console.log(subscription)
  if (!subscriptions[subscription.topic]) {
    subscriptions[subscription.topic] = [];
  }
  subscriptions[subscription.topic].push({
    name: subscription.subscriber,
    address: subscription.subscriberAddress,
  });
  res.json({ message: 'Subscription received' });
});

app.post('/message', async (req, res) => {
  const envelope = req.body;
  const topic = envelope.topic;
  const message = envelope.message;

  if (!messages[topic]) messages[topic] = [];
  const wrappedMessage = { ...message, id: uuid.v4(), subscribers: subscriptions[topic] || [] };
  messages[topic].push(wrappedMessage);
  res.json({ message: 'ok' })

  for (const subscriber of wrappedMessage.subscribers) {
    try {
      await axios.post(subscriber.address, message);
      wrappedMessage.subscribers = wrappedMessage.subscribers
        .filter(({ name }) => name !== subscriber.name)
    } catch (e) {}
  }

  if (wrappedMessage.subscribers.length === 0) {
    messages[topic] = messages[topic].filter(message => message !== wrappedMessage);
  }
});

const printMessages = () => {
  setTimeout(() => {
    console.log(messages);
    printMessages();
  }, 500);
};

// printMessages();

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
