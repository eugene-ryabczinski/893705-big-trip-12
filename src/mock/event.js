import {range} from 'lodash';

const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const EVENT_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];

export const CITIES = [`Amsterdam`, `Chamonix`, `Geneva`];

const generatEventType = () => {
  const randomIndex = randomInt(0, EVENT_TYPES.length - 1);

  return EVENT_TYPES[randomIndex];
};

const generateСities = () => {
  const randomIndex = randomInt(0, CITIES.length - 1);

  return CITIES[randomIndex];
};

const generatDestinationDescription = () => {
  const source = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const texts = source.split(`.`).map((text) => text.trim()).filter((el) => el);

  const takes = randomInt(1, 5);

  let resultString = ``;

  for (let i = 0; i <= takes; i++) {
    let randomIndex = randomInt(0, texts.length - 1);

    resultString = resultString.concat(texts[randomIndex]).concat(`. `).trim();
    if (i === takes) {
      resultString = resultString.trim();
    }
  }

  return resultString;
};

const generateDestinationPictures = () => {
  const takes = randomInt(1, 5);
  let pictures = [];

  for (let i = 0; i < takes; i++) {
    pictures.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return pictures;
};

const generateCost = (start = 20, end = 600, step = 25) => {
  const cost = range(start, end, step);

  const randomIndex = randomInt(0, cost.length - 1);

  return cost[randomIndex];
};

const generateStartDate = () => {
  const startDate = new Date();
  const minutes = [...Array(13).keys()].map((k) => k * 5);

  startDate.setDate(startDate.getDate() + randomInt(1, 7));
  startDate.setHours(randomInt(24), minutes[randomInt(0, minutes.length - 1)], 0);

  return startDate;
};

const generateEndDate = (startDate) => {
  const endDate = new Date(startDate.getTime());
  const minutes = [...Array(13).keys()].map((k) => k * 5);

  endDate.setHours(endDate.getHours() + randomInt(0, 3), endDate.getMinutes() + minutes[randomInt(0, minutes.length - 1)], 0);

  return endDate;
};

const generateOffers = () => {
  const offersMap = new Map();

  offersMap
    .set(`Flight`, [
      {name: `Add luggage`, cost: generateCost(20, 80, 25)},
      {name: `Switch to comfort class`, cost: generateCost(20, 80, 15)},
      {name: `Add meal`, cost: generateCost(20, 80, 25)},
      {name: `Choose seats`, cost: generateCost(20, 80, 25)}
    ])
    .set(`Taxi`, [
      {name: `Switch to comfort class`, cost: generateCost(20, 80, 25)},
      {name: `Order Uber`, cost: generateCost(20, 80, 25)}
    ])
    .set(`Train`, [
      {name: `Switch to comfort class`, cost: generateCost(20, 80, 25)}
    ])
    .set(`Ship`, [
      {name: `Switch to comfort class`, cost: generateCost(20, 80, 25)}
    ])
    .set(`Check-in`, [
      {name: `Add breakfast`, cost: generateCost(20, 80, 25)}
    ])
    .set(`Sightseeing`, [
      {name: `Book tickets`, cost: generateCost(20, 80, 25)},
      {name: `City Tour`, cost: generateCost(20, 80, 25)},
      {name: `Lunch in city`, cost: generateCost(20, 80, 25)}
    ])
    .set(`Drive`, [
      {name: `Rent a car`, cost: generateCost(20, 80, 25)}
    ]);

  return offersMap;
};

export const generateEvent = () => {
  const type = generatEventType();

  const offers = generateOffers().has(type)
    ? generateOffers().get(type).map((offer) => {
      return {
        ...offer, isChecked: Boolean(randomInt(0, 1))
      };
    })
    : [];

  const startDate = generateStartDate();

  const endDate = generateEndDate(startDate);

  const offersSum = offers.filter((offer) => offer.isChecked).reduce((prev, cur) => {
    return prev + cur.cost;
  }, 0);

  const cost = generateCost() + offersSum;

  return {
    type,
    destination: generateСities(),
    destinationInfo: {
      description: generatDestinationDescription(),
      pictures: generateDestinationPictures()
    },
    cost,
    offers,
    startDate,
    endDate,
    isFavourite: Boolean(randomInt(0, 1))
  };
};
