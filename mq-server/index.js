const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

const messages = {};

app.get('/message', (req, res) => {
  const { receiver, count = 1 } = req.query;
  if (messages[receiver] && messages[receiver].length > 0) {
    let responseMessages = [];
    for (let i = 0; i < Number(count); i++) {
      responseMessages.push(messages[receiver].pop());
    }
    res.json({ messages: responseMessages });
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
