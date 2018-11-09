const { Subscriber } = require('./subscriber/subscriber-mq');

const name = process.argv[2];

const sub = new Subscriber(name);

sub
  .start()
  .then(() => {
    console.log('Done');
  })
  .catch((e) => {
    console.log('help');
    console.log(e);
  });
