import Filter from "../view/filter";
import {renderElement, RenderPosition, replace, removeCommponent} from '../utils/render';
import TripEventItem from '../view/trip-event-Item';
import TripEventItemEdit from '../view/trip-event-item-edit';
import {SORT_TYPE, USER_ACTION, UPDATE_TYPE} from '../const';

export default class FilterPresenter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this); // зачем?
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._filterComponent = new Filter();
    this._filterComponent.setFilterChangeHandle(this._handleFilterTypeChange);

    renderElement(this._filterContainer, this._filterComponent, RenderPosition.AFTEREND);
  }

  _handleModelEvent() {
    // this.init();
  }

  _handleFilterTypeChange(filterType) {
    this._filterModel.setFilter(UPDATE_TYPE.MINOR, filterType);
  }

  _getFilters() {
    //
  }
}
