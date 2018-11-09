const uuid = require('uuid');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const generatePurchase = () => {
  return {
    id: uuid.v4(),
    date: new Date(),
    price: getRandomInt(1, 101),
    category: getRandomInt(1, 6),
    customer: {
      id: uuid.v4(),
    },
  };
};

module.exports = {
  generatePurchase,
};
