import {EVENT_TYPES, EVENT_TRANSFER_LIST, EVENT_ACTIVITIES_LIST, CITIES} from '../const';
import {isEqual, cloneDeep} from '../utils/common';
import moment from 'moment';
import Smart from './smart';
import {generateOffers} from '../mock/event'; // стоит ли использовать тут?

const NEW_EVENT = {
  type: EVENT_TYPES[0],
  destination: ``,
  destinationInfo: null,
  cost: ``,
  offers: [],
  startDate: null,
  endDate: null,
  isFavourite: false
};

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

export const createTripEventItemEditTemplate = (data = {}) => {
  const {
    type,
    destination,
    destinationInfo,
    cost,
    offers,
    startDate,
    endDate,
    isFavourite,
  } = data;

  const eventSelectorTemplate = createEventSelectorTemplate(type);
  const eventDetailsTemplate = createEventDetailsTemplate(offers, destinationInfo);
  const destinationList = createDestinationList();
  const startDateFormated = startDate ? moment(startDate).format(`DD/MM/YY hh:mm`) : moment().format(`DD/MM/YY hh:mm`);
  const endDateFormated = endDate ? moment(endDate).format(`DD/MM/YY hh:mm`) : moment().format(`DD/MM/YY hh:mm`);

  const placeholder = () => {
    return EVENT_ACTIVITIES_LIST.map((event) => event.toLowerCase()).includes(type) ? `${type} in` : `${type} to`;
  };

  const isNewEvent = () => isEqual(event, NEW_EVENT);

  return (`<form class="trip-events__item  event  event--edit" action="#" method="post">
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
      
      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavourite ? `checked` : ``}>
      <label class="event__favorite-btn ${isNewEvent() ? `visually-hidden` : ``}" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      ${isNewEvent() ? `<button class="event__reset-btn" type="reset">Cancel</button>` : `<button class="event__reset-btn">Delete</button>`} 
    </header>
    ${eventDetailsTemplate}
  </form>`
  );
};

export default class TripEventItemEdit extends Smart {
  constructor(event) {
    super();
    this._event = event || NEW_EVENT;

    this._data = cloneDeep(this._event);

    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);

    this._formSubmitClickHandler = this._formSubmitClickHandler.bind(this);
    this._isFavouriteClickHandler = this._isFavouriteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  _setInnerHandlers() {

    const tripTypeRadio = this.getElement().querySelectorAll(`.event__type-input`);
    tripTypeRadio.forEach((element) => {
      element.addEventListener(`change`, this._eventTypeChangeHandler);
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _eventTypeChangeHandler(evt) {
    const updatedType = evt.target.value;
    const AllOffers = generateOffers(); // ?
    const typeOffers = [];

    const findOfferIndex = Array.from(AllOffers.keys())
      .map((offerType) => offerType.toLowerCase())
      .indexOf(updatedType);

    if (findOfferIndex > -1) {
      typeOffers.push(...AllOffers.get(Array.from(AllOffers.keys())[findOfferIndex]));
    }

    this.updateData({
      type: updatedType,
      offers: typeOffers
    });
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null; // Чтобы окончательно "убить" ссылку на prevElement
    this.restoreHandlers();
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    this.updateElement();
  }

  getTemplate() {
    return createTripEventItemEditTemplate(this._data);
  }

  _formSubmitClickHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._event); // должны отправить event или data?
  }

  _isFavouriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favouriteClick(evt.target.checked); // 3. in handler run callback function
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitClickHandler);
  }

  setFavouriteClickHandler(callback) {
    this._callback.favouriteClick = callback; // 1. write callback here
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, this._isFavouriteClickHandler); // 2. add handler
  }
}
