import {renderElement, RenderPosition, removeCommponent} from '../utils/render';
import HeaderTripInfo from '../view/header-trip-info';
import {groupEventsByDay} from '../utils/event';
import {getTripInfo} from '../mock/trip';

export default class TripInfoPresenter {
  constructor(headerContainer, eventsModel) {
    this._headerContainer = headerContainer;
    this._eventsModel = eventsModel;
    this._headerTripInfo = null;

    this._events = this._eventsModel.getEvents();
    this._events = groupEventsByDay(this._eventsModel.getEvents());
    this._tripInfo = getTripInfo(this._events);

    this._handleModelChange = this._handleModelChange.bind(this);
    this._eventsModel.addObserver(this._handleModelChange);
  }

  init() {
    this._renderTripInfo();
  }

  _handleModelChange() {
    removeCommponent(this._headerTripInfo);
    this._events = groupEventsByDay(this._eventsModel.getEvents());
    this._tripInfo = getTripInfo(this._events);
    this._renderTripInfo();
  }

  _renderTripInfo() {
    this._headerTripInfo = new HeaderTripInfo(this._tripInfo);
    renderElement(this._headerContainer, this._headerTripInfo, RenderPosition.AFTERBEGIN);
  }
}
