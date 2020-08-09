const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1))
}

const generatEventType = () => {
  const eventTypes = [
    `Taxi`, 
    `Bus`, 
    `Train`, 
    `Ship`, 
    `Transport`, 
    `Drive`, 
    `Flight`, 
    `Check-in`, 
    `Sightseeng`, 
    `Restaurant`
  ]
  const randomIndex = randomInt(0, eventTypes.length -1);

  return eventTypes[randomIndex];
}

const generateСities = () => {
  const cities = [`Amsterdam`, `Chamonix`, `Geneva`];

  const randomIndex = randomInt(0, cities.length -1);
  
  return cities[randomIndex];
}

const generatDestinationDescription = () => {
  const source = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`

  const texts = source.split(`.`).map(text => text.trim()).filter(el => el); // const texts = source.split(`.`).map(text => text.trim()).filter(el => el.length != 0);

  const takes = randomInt(1, 5);

  let resultString = ``;

  for (let i = 0; i <= takes; i++) {
    let randomIndex = randomInt(0, texts.length -1);

    resultString = resultString.concat(texts[randomIndex]).concat(`. `).trim()
    if (i == takes) {
      resultString = resultString.trim();
    }
  }

  return resultString;
}

const generateDestinationPictures = () => {
  const takes = randomInt(1, 5);
  let pictures = [];

  for (let i = 0; i < takes; i++) {
    pictures.push(`http://picsum.photos/248/152?r=${Math.random()}`)
  }

  return pictures;
}

const generateCost = () => {
  const cost = randomInt(20, 600)
  return cost 
}

const generateStartDate = () => {
  const startDate = new Date();

  startDate.setDate(startDate.getDate() + randomInt(1, 7));

  return startDate;
}

const generateEndDate = (startDate) => {
  const endDate = new Date(startDate.getTime());

  endDate.setHours(endDate.getHours(), endDate.getMinutes() + randomInt(1, 60) * randomInt(1, 5));

  return endDate
}

const generateOffers = (type) => {
  const offers = [
    { name: `Add luggage`, type: [`Flight`], cost: generateCost() },
    { name: `Switch to comfort class`, type: [`Flight`, `Train`, `Ship`, `Taxi`], cost: generateCost() },
    { name: `Add meal`, type: [`Flight`], cost: generateCost() },
    { name: `Choose seats`, type: [`Flight`], cost: generateCost() },
    { name: `Rent a car`, type: [`Drive`], cost: generateCost() },
    { name: `Add breakfast`, type: [`Check-in`],  cost: generateCost() },
    { name: `Book tickets`, type: [`Sightseeing`],  cost: generateCost() },
    { name: `City Tour`, type: [`Sightseeing`], cost: generateCost() },
    { name: `Lunch in city `, type: [`Sightseeing`], cost: generateCost() },
    { name: `Add breakfast`, type: [`Check-in`], cost: generateCost() },
  ];

  const result = offers
    .filter(offer => offer.type.find(eventType => eventType == type))
    .map((offer) => {
      return {
        name: offer.name,
        cost: offer.cost
      }
    })

  return result
}

export const generateEvent = () => {
  const type = generatEventType();

  const offers = generateOffers(type).map(offer => {
    return {
      ...offer,
      isChecked: Boolean(randomInt(0,1)) 
    }
  })

  const startDate = generateStartDate();

  const endDate = generateEndDate(startDate);

  return {
    type,
    destination: generateСities(),
    destinationInfo: { 
      description: generatDestinationDescription(),
      pictures: generateDestinationPictures()
    },
    cost: generateCost(),
    offers,
    startDate,
    endDate,
  }
}
