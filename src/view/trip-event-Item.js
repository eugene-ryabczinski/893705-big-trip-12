import moment from 'moment';
import { createElement } from '../utils';

export const createTripEventItemTemplate = (event) => {
  const {type, destination, endDate, startDate, offers = [], cost} = event;

  const formatDate = (date) => {
    const momentDate = moment(date);
    return momentDate.format(`HH:mm`);
  };

  const getDuration = (start, end) => {
    const momentStart = moment(start);
    const momentEnd = moment(end);

    const diff = momentEnd.diff(momentStart);

    const duration = moment.duration(diff);

    const dateParts = [`days`, `hours`, `minutes`];

    let resultString = ``;

    for (let part of dateParts) {
      if (duration[part]() !== 0) {
        resultString = resultString.concat(`${duration[part]()}${(part.substring(0, 1)).toUpperCase()} `);
      }
    }

    return resultString;
  };

  const duration = getDuration(startDate, endDate);

  const createSelectedOffersTemplate = (offersToRender) => {
    if (offersToRender.length === 0) {
      return (`<li class="event__offer"></li>`);
    } else {
      return offersToRender.map(({name, cost}) => {
        return (
          `<li class="event__offer">
            <span class="event__offer-title">${name}</span> &plus;&euro;&nbsp;<span class="event__offer-price">${cost}</span>
          </li>`
        );
      }).join(``);
    }
  };
  const selectedOffersToRender = offers.slice(0, 3);

  const selectedOffersTemplate = createSelectedOffersTemplate(selectedOffersToRender);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} to ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${moment(startDate).format()}">${formatDate(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${moment(startDate).format()}">${formatDate(endDate)}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${cost}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${selectedOffersTemplate}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class TripEventItem {
  constructor(event) {
    this._event = event; 
    this._element = null;
  }

  getTemplate() {
    return createTripEventItemTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
