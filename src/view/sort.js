import AbstractView from './abstract-view';
import {SORT_TYPE} from '../const';

const createSortTemplate = () => {
  return (
    `<div class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
    
      <div class="trip-sort__item  trip-sort__item--event">
        <input id="${SORT_TYPE.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SORT_TYPE.EVENT}" checked>
        <label class="trip-sort__btn" for="${SORT_TYPE.EVENT}">Event</label>
      </div>
    
      <div class="trip-sort__item  trip-sort__item--time">
        <input id="${SORT_TYPE.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SORT_TYPE.TIME}">
        <label class="trip-sort__btn" for="${SORT_TYPE.TIME}">
          Time
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>
    
      <div class="trip-sort__item  trip-sort__item--price">
        <input id="${SORT_TYPE.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SORT_TYPE.PRICE}">
        <label class="trip-sort__btn" for="${SORT_TYPE.PRICE}">
          Price
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>
    
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </div>`
  );
};

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortChangeHandler(evt) {
    this._callback.sort(evt.target.value);
  }

  setSortChangeHandler(callback) {
    const radioList = this.getElement().querySelectorAll(`.trip-sort__input`);

    this._callback.sort = callback;

    radioList.forEach((element) => {
      element.addEventListener(`change`, this._sortChangeHandler);
    });
  }
}
