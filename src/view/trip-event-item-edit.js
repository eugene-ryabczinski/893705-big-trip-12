import {EVENT_TYPES, EVENT_TRANSFER_LIST, EVENT_ACTIVITIES_LIST, CITIES} from '../const';
import moment from 'moment';

const createOffersSelectorTemplate = (offers) => {
  if (offers.length === 0) {
    return ``;
  }

  const createOffersSelectorList = () => {
    return offers.map(({name, cost, isChecked}) => {
      const attributeName = name.toLowerCase().replace(/ /g, `_`);
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${attributeName}" type="checkbox" name="event-offer-${attributeName}" ${isChecked ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${attributeName}>
            <span class="event__offer-title">${name}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${cost}</span>
          </label>
        </div>`
      );
    }).join(``);
  };

  const offersList = createOffersSelectorList();

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersList}
      </div>
    </section>`
  );
};

const createDescriptionTemplate = (destinationInfo) => {
  const {description, pictures} = destinationInfo;

  if (description === null && pictures.length === 0) {
    return ``;
  }

  const createPhotosListtemplate = () => {
    return pictures.map((picture) => {
      return (
        `<img class="event__photo" src="${picture}" alt="Event photo">`
      );
    }).join(` `);
  };

  const photosList = createPhotosListtemplate(pictures);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">
        ${description}
      </p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosList}
        </div>
      </div>
    </section>`
  );
};

const createEventDetailsTemplate = (offers = [], destinationInfo = null) => {
  if (offers.length === 0 && destinationInfo === null) {
    return ``;
  }

  const offersSelectorTemplate = createOffersSelectorTemplate(offers);
  const descriptionTemplate = createDescriptionTemplate(destinationInfo);

  return (
    `<section class="event__details">
      ${offersSelectorTemplate}
      ${descriptionTemplate}
    </section>`
  );
};

const createEventSelectorTemplate = (type) => {

  const createElementListTemplate = (event) => {
    return (
      `<div class="event__type-item">
        <input id="event-type-${event.toLowerCase()}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${event.toLowerCase()}" ${event === type ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${event.toLowerCase()}" for="event-type-${event.toLowerCase()}">${event}</label>
      </div>
      `
    );
  };

  return (`
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Transfer</legend>
        ${EVENT_TRANSFER_LIST.map((event) => createElementListTemplate(event)).join(` `)}
      </fieldset>

      <fieldset class="event__type-group">
        <legend class="visually-hidden">Activity</legend>
        ${EVENT_ACTIVITIES_LIST.map((event) => createElementListTemplate(event)).join(` `)}
      </fieldset>
    </div>
  </div>`);
};

const createDestinationList = () => {
  return CITIES.map((city) => {
    return (`
      <option value="${city}"></option>
    `);
  }).join(` `);
};

export const createTripEventItemEditTemplate = (event = {}) => {
  const {
    type = EVENT_TYPES[0],
    destination = null,
    destinationInfo = null,
    cost = ``,
    offers = [],
    startDate = null,
    endDate = null,
  } = event;

  const eventSelectorTemplate = createEventSelectorTemplate(type);
  const eventDetailsTemplate = createEventDetailsTemplate(offers, destinationInfo);
  const destinationList = createDestinationList();
  const startDateFormated = startDate ? moment(startDate).format(`DD/MM/YY hh:mm`) : moment().format(`DD/MM/YY hh:mm`);
  const endDateFormated = endDate ? moment(endDate).format(`DD/MM/YY hh:mm`) : moment().format(`DD/MM/YY hh:mm`);

  const placeholder = () => {
    return EVENT_ACTIVITIES_LIST.includes(type) ? `${type} in` : `${type} to`;
  };

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
    <div class="event__type-wrapper">
      ${eventSelectorTemplate}
    </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${placeholder()}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${destinationList}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateFormated}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDateFormated}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    ${eventDetailsTemplate}
  </form>`
  );
};
