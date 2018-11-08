const { Subscriber } = require('./billing-service/subscriber');

const name = process.argv[2];
const topic = process.argv[3];
const port = process.argv[4];

const sub = new Subscriber(name, topic, port);
sub.start();
