import AbstractView from './abstract-view';
import {FILTER_TYPE} from '../const';


const createFilterTemplate = () => {
  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-${FILTER_TYPE.EVERYTHING}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FILTER_TYPE.EVERYTHING}" checked>
        <label class="trip-filters__filter-label" for="filter-${FILTER_TYPE.EVERYTHING}">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-${FILTER_TYPE.FUTERE}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FILTER_TYPE.FUTERE}">
        <label class="trip-filters__filter-label" for="filter-${FILTER_TYPE.FUTERE}">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-${FILTER_TYPE.PAST}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FILTER_TYPE.PAST}">
        <label class="trip-filters__filter-label" for="filter-${FILTER_TYPE.PAST}">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractView {
  constructor() {
    super();
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate();
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();
    const filter = evt.target.value;
    this._callback.filterChange(filter);
  }

  setFilterChangeHandle(callback) {
    this._callback.filterChange = callback;

    const filterRadioButtons = this.getElement().querySelectorAll(`.trip-filters__filter-input`);

    filterRadioButtons.forEach((element) => {
      element.addEventListener(`change`, this._filterChangeHandler);
    });
  }
}
