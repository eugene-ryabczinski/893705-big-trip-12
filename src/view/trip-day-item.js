import moment from 'moment';
import { createElement } from '../utils';

const createTripDayItemTemplate = (day, index) => {
  const formatedDate = moment(day).format(`MMM DD`);
  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${day}">${formatedDate}</time>
      </div>
    </li>`
  );
};

export default class TripDayItem {
  constructor(day, dayCount) {
    this._day = day;
    this._dayCount = dayCount;
    this._element = null;
  }

  getTemplate() {
    return createTripDayItemTemplate(this._day, this._dayCount);
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
