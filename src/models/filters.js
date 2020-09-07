import Observer from '../utils/observer';
import {FILTER_TYPE} from '../const';

export default class FiltersModel extends Observer {
  constructor() {
    super();
    this._activeFilter = FILTER_TYPE.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
