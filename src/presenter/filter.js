import Filter from "../view/filter";
import {renderElement, RenderPosition} from '../utils/render';
import {UPDATE_TYPE} from '../const';

export default class FilterPresenter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._filterComponent = new Filter();
    this._filterComponent.setFilterChangeHandle(this._handleFilterTypeChange);

    renderElement(this._filterContainer, this._filterComponent, RenderPosition.AFTEREND);
  }

  _handleModelEvent() {}

  _handleFilterTypeChange(filterType) {
    this._filterModel.setFilter(UPDATE_TYPE.MINOR, filterType);
  }
}
