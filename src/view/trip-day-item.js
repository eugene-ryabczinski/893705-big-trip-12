import moment from 'moment';
import AbstractView from './abstract-view';

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

export default class TripDayItem extends AbstractView {
  constructor(day, dayCount) {
    super();
    this._day = day;
    this._dayCount = dayCount;
  }

  getTemplate() {
    return createTripDayItemTemplate(this._day, this._dayCount);
  }
}
