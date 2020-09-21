import {EVENT_TYPES, EVENT_TRANSFER_LIST, EVENT_ACTIVITIES_LIST} from '../const';
import {cloneDeep} from '../utils/common';
import moment from 'moment';
import Smart from './smart';
import flatpickr from "flatpickr";
import {MODE} from '../const';

export const NEW_EVENT = {
  type: EVENT_TYPES[0],
  destination: ``,
  destinationInfo: null,
  cost: ``,
  offers: [],
  startDate: null,
  endDate: null,
  isFavorite: false
};

const createOffersSelectorTemplate = (offers) => {
  if (offers.length === 0) {
    return ``;
  }

  const createOffersSelectorList = () => {
    return offers.map((offer) => {
      const offerName = offer.name.toLowerCase().replace(/ /g, `_`);
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerName}" type="checkbox" name="event-offer-${offerName}" ${offer.isChecked ? `checked` : ``} value="${offerName}">
          <label class="event__offer-label" for="event-offer-${offerName}">
            <span class="event__offer-title">${offer.name}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.cost}</span>
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
  if (destinationInfo === null) {
    return false;
  }

  const {description, pictures} = destinationInfo;

  const createPhotosListTemplate = () => {
    return pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join(` `);
  };

  const photosList = createPhotosListTemplate(pictures);

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
      ${offersSelectorTemplate ? offersSelectorTemplate : ``}
      ${descriptionTemplate ? descriptionTemplate : ``}
    </section>`
  );
};

const createEventSelectorTemplate = (type) => {
  const createElementListTemplate = (event) => {
    return (
      `<div class="event__type-item">
        <input id="event-type-${event.toLowerCase()}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${event.toLowerCase()}" ${event.toLowerCase() === type ? `checked` : ``}>
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

const createDestinationList = (destinations) => {
  return destinations.map((destination) => {
    return (`
      <option value="${destination.name}"></option>
    `);
  }).join(` `);
};

export const createTripEventItemEditTemplate = (data = {}, destinations, mode) => {
  const {
    type,
    destination,
    destinationInfo,
    cost,
    offers,
    startDate,
    endDate,
    isFavourite,
    isDisabled,
    isSaving,
    isDeleting
  } = data;

  const eventSelectorTemplate = createEventSelectorTemplate(type);
  const eventDetailsTemplate = createEventDetailsTemplate(offers, destinationInfo);
  const destinationList = createDestinationList(destinations);
  const startDateFormated = startDate ? moment(startDate).format(`DD/MM/YY hh:mm`) : moment().format(`DD/MM/YY hh:mm`);
  const endDateFormated = endDate ? moment(endDate).format(`DD/MM/YY hh:mm`) : moment().format(`DD/MM/YY hh:mm`);

  const placeholder = () => {
    if (EVENT_ACTIVITIES_LIST.map((event) => event.toLowerCase()).includes(type.toLowerCase())) {
      return `${type.charAt(0).toUpperCase() + type.slice(1)} in`;
    } else {
      return `${type.charAt(0).toUpperCase() + type.slice(1)} to`;
    }
  };

  return (`<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
      <div class="event__type-wrapper">
        ${eventSelectorTemplate}
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${placeholder()}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1" ${isDisabled ? `disabled` : ``}>
        <datalist id="destination-list-1">
          ${destinationList}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateFormated}" ${isDisabled ? `disabled` : ``}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDateFormated}" ${isDisabled ? `disabled` : ``}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}" ${isDisabled ? `disabled` : ``}>
      </div>
      
      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavourite ? `checked` : ``}>
      <label class="event__favorite-btn ${mode === MODE.CREATE ? `visually-hidden` : ``}" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
      ${mode === MODE.CREATE ? `<button class="event__reset-btn" type="reset">Cancel</button>` : `<button class="event__reset-btn" ${isDisabled ? `disabled` : ``}>${isDeleting ? `Deleting...` : `Delete`}</button>`} 
    </header>
    ${eventDetailsTemplate}
  </form>`
  );
};

export default class TripEventItemEdit extends Smart {
  constructor(event, offers, destinations, mode) {
    super();
    this._event = event || NEW_EVENT;
    this._offers = offers;
    this._destinations = destinations;
    this._cities = this._destinations.map((destination) => destination.name);

    this._mode = mode || MODE.EDITING; // по умолчанию edit

    this._data = TripEventItemEdit.parseEventToData(this._event);

    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._startDate = this._event.startDate || new Date();
    this._endDate = this._event.endDate || new Date();

    this._cost = this._event.cost;

    this._saveButton = this.getElement().querySelector(`.event__save-btn`);

    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._offersSelectorHandler = this._offersSelectorHandler.bind(this);
    this._destinationSelectorHandler = this._destinationSelectorHandler.bind(this);
    this._isFavouriteClickHandler = this._isFavouriteClickHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._startDateInputhandler = this._startDateInputhandler.bind(this);
    this._endDateInputhandler = this._endDateInputhandler.bind(this);

    this._formSubmitClickHandler = this._formSubmitClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._setInnerHandlers();

    this._validateForm();
  }

  _setDatePicker() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    const config = {
      dateFormat: `d/m/y H:i`,
      enableTime: true,
    };

    this._datepickerStart = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          ...config,
          defaultDate: this._data.startDate || new Date(),
          onChange: this._startDateInputhandler || new Date()
        }
    );

    this._datepickerEnd = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          ...config,
          defaultDate: this._data.endDate,
          onChange: this._endDateInputhandler
        }
    );
  }

  _setInnerHandlers() {
    const tripTypeRadio = this.getElement().querySelectorAll(`.event__type-input`);
    tripTypeRadio.forEach((element) => {
      element.addEventListener(`change`, this._eventTypeChangeHandler);
    });

    const destinationSelector = this.getElement().querySelector(`.event__input--destination`);
    destinationSelector.addEventListener(`change`, this._destinationSelectorHandler);

    const priceInput = this.getElement().querySelector(`.event__input--price`);
    priceInput.addEventListener(`input`, this._priceInputHandler);

    const offersCheckboxes = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    offersCheckboxes.forEach((element) => {
      element.addEventListener(`change`, this._offersSelectorHandler);
    });

    this._setDatePicker();
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFavouriteClickHandler(this._callback.favouriteClick);
    this.setDeleteClickHandle(this._callback.deleteClick);
  }

  _validateForm() {
    this._saveButton = this.getElement().querySelector(`.event__save-btn`);
    if (!this._isValidPriceInput() || !this._isValidDateRange() || !this._isValidDestination()) {
      this._saveButton.setAttribute(`disabled`, `disabled`);
      return;
    }
    this._saveButton.removeAttribute(`disabled`, `disabled`);
  }

  _isValidDestination() {
    const destinationSelector = this.getElement().querySelector(`.event__input--destination`);

    if (destinationSelector.value === `` || !this._cities.map((city) => city.toLowerCase()).includes(destinationSelector.value.toLowerCase())) {
      return false;
    }

    return true;
  }

  _isValidDateRange() {
    const start = moment(this._startDate);
    const end = moment(this._endDate);

    if ((start.isSame(end)) || (start.isAfter(end))) {
      return false;
    }
    return true;
  }

  _isValidPriceInput() {
    if (this._data.cost === ``) {
      return false;
    }
    return true;
  }

  _priceInputHandler(evt) {
    evt.currentTarget.value = evt.currentTarget.value.replace(/[^0-9]/g, ``); // временное решение запрещать ввод не числовых значений через regexp
    this._cost = Number(evt.currentTarget.value);
    this._data.cost = this._cost;

    this._validateForm();
  }

  _startDateInputhandler([date]) {
    this._startDate = date;

    this._validateForm();

    this.updateData({
      startDate: this._startDate,
    }, true);
  }

  _endDateInputhandler([date]) {
    this._endDate = date;

    this._validateForm();

    this.updateData({
      endDate: this._endDate,
    }, true);
  }

  _offersSelectorHandler(evt) {
    const offerName = evt.target.value.replace(/_/g, ` `);
    const findIndex = this._data.offers.map((offer) => offer.name.toLowerCase()).indexOf(offerName);
    const updatedOffers = cloneDeep(this._data.offers);

    updatedOffers[findIndex].isChecked = evt.target.checked;

    this.updateData({
      offers: updatedOffers
    }, true);
  }

  _eventTypeChangeHandler(evt) {
    const updatedType = evt.target.value;
    const findEventTypeIndex = EVENT_TYPES
      .map((eventType) => eventType.toLowerCase())
      .indexOf(updatedType);

    const typeOffers = this._offers
      .filter((offerType) => offerType.type.toLowerCase() === updatedType.toLowerCase());

    this.updateData({
      type: EVENT_TYPES[findEventTypeIndex],
      offers: typeOffers[0].offers
    });
    this._validateForm();
  }

  reset(event) {
    this.updateData(TripEventItemEdit.parseEventToData(event));
  }

  _destinationSelectorHandler(evt) {
    const selectedCity = evt.target.value;
    const findIndex = this._cities.indexOf(selectedCity);
    if (findIndex > -1) {
      this.updateData({
        destination: selectedCity,
        destinationInfo: this._destinations[findIndex]
      });
    }
    this._validateForm();
  }

  getTemplate() {
    return createTripEventItemEditTemplate(this._data, this._destinations, this._mode);
  }

  _formSubmitClickHandler(evt) {
    this._data.startDate = this._startDate;
    this._data.endDate = this._endDate;
    this._cost = this._cost;
    evt.preventDefault();
    this._callback.formSubmit(TripEventItemEdit.parseDataToEvent(this._data));
  }

  _isFavouriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favouriteClick(evt.target.checked, this._data);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitClickHandler);
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        });
  }

  setFavouriteClickHandler(callback) {
    this._callback.favouriteClick = callback;
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, this._isFavouriteClickHandler);
  }

  setDeleteClickHandle(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
  }

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
  }
}
