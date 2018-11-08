const express = require('express')
const uuid = require('uuid')
const axios = require('axios')
const app = express()
const port = 3000

app.use(express.json());


app.get('/message', (req, res) => {
});

app.post('/message', async (req, res) => {
});

const printMessages = () => {
  setTimeout(() => {
    console.log(messages);
    printMessages();
  }, 500);
};

// printMessages();

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
