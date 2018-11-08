const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

const messages = {};

app.get('/message', (req, res) => {
  const { receiver } = req.body;
  if (messages[receiver] && messages[receiver].length > 0) {
    res.json({ message: messages[receiver].pop() })
  } else {
    res.status(404).json({ error: 'No messages for receiver' });
  }
});

app.post('/message', async (req, res) => {
  const { receiver, message } = req.body;
  if (!messages[receiver]) messages[receiver] = [];

  messages[receiver].push(message);
  res.json({ message: 'ok '});
});

const printMessages = () => {
  setTimeout(() => {
    console.log(messages);
    printMessages();
  }, 500);
};

// printMessages();

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
