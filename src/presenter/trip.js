import {SORT_TYPE, USER_ACTION, UPDATE_TYPE} from '../const';
import {renderElement, RenderPosition, removeCommponent} from '../utils/render';
import {groupEventsByDay, sortByDuration, sortByPrice} from '../utils/event';
import {updateItem} from '../utils/common';

import Sort from '../view/sort';
import TripDaysList from '../view/trip-days-list';
import TripDayItem from '../view/trip-day-item';
import TripEventsList from '../view/trip-events-list';
import TripEventItem from '../view/trip-event-Item';
import TripEventItemEdit from '../view/trip-event-item-edit';
import NoEvents from '../view/no-events';
import Event from '../presenter/event';

export default class Trip {
  constructor(tripEventsMainContainerElement, eventsModel) {
    this._tripEventsMainContainerElement = tripEventsMainContainerElement;

    this._eventsModel = eventsModel;

    this._sortComponent = new Sort();
    this._tripDaysListComponent = new TripDaysList();
    this._tripEventsListComponent = new TripEventsList();
    this._tripEventItemComponent = new TripEventItem();
    this._tripEventItemEditComponent = new TripEventItemEdit();
    this._noEventsComponent = new NoEvents();

    this._eventPresenter = {};
    this._currentSortType = SORT_TYPE.EVENT;

    this._sortChangeHandler = this._sortChangeHandler.bind(this);
    // this._handleEventChange = this._handleEventChange.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SORT_TYPE.EVENT:
        return this._eventsModel.getEvents();
      case SORT_TYPE.TIME:
        return this._eventsModel.getEvents().slice().sort(sortByDuration);
      case SORT_TYPE.PRICE:
        return this._eventsModel.getEvents().slice().sort(sortByPrice);
    }
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => {
        presenter.resetView();
      });
  }

  _handleViewAction(actionType, updateType, updatedEvent) {
    // debugger
    console.log(actionType, updateType, updatedEvent);
    switch (actionType) {
      case USER_ACTION.UPDATE_EVENT:
        this._eventsModel.updateEvents(updateType, updatedEvent);
        break;
      case USER_ACTION.ADD_EVENT:
        this._eventsModel.addEvent(updateType, updatedEvent);
        break;
      case USER_ACTION.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, updatedEvent);
        break;
    }

    // this._events = updateItem(this._events, event);
    // this._eventPresenter[event.id].init(event);
  }

  _handleModelEvent(updateType, data) {
    // debugger
    console.log(updateType, data);
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UPDATE_TYPE.MINOR:
        this._clearEventList();
        this._renderTrip();
        break;
      case UPDATE_TYPE.MAJOR:
        break;
    }
  }

  _sortChangeHandler(event) {
    this._currentSortType = event;
    this._clearEventList();
    this._renderTrip();
  }

  _clearEventList() {
    Object.values(this._eventPresenter).forEach((presenter) => {
      presenter.destroy();
    });
    this._eventPresenter = {};
    removeCommponent(this._tripDaysListComponent);
  }

  _renderSort() {
    renderElement(this._tripEventsMainContainerElement, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortChangeHandler(this._sortChangeHandler);
  }

  _renderNoEvents() {
    renderElement(this._tripEventsMainContainerElement, new NoEvents(), RenderPosition.BEFOREEND);
  }

  _renderEvent(eventsListElement, event) {
    // const eventPresenter = new Event(eventsListElement, this._handleEventChange, this._handleModeChange);
    const eventPresenter = new Event(eventsListElement, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents(dayDate, count, events) {
    renderElement(this._tripEventsMainContainerElement, this._tripDaysListComponent, RenderPosition.BEFOREEND);
    const tripDayItemComponent = new TripDayItem(dayDate, count);
    renderElement(this._tripDaysListComponent, tripDayItemComponent, RenderPosition.BEFOREEND);

    const tripEventsListComponent = new TripEventsList();
    renderElement(tripDayItemComponent, tripEventsListComponent, RenderPosition.BEFOREEND);

    events.forEach((event) => {
      this._renderEvent(tripEventsListComponent, event);
    });
  }

  _renderEventsByDay(eventsGroupedByDay) {
    Object.entries(eventsGroupedByDay).forEach(([day, events], index) => {
      this._renderEvents(day, index + 1, events);
    });
  }

  _renderTrip() {
    // debugger
    const events = this._getEvents(); // завязываемся на модель. в _getEvents получаем отсортированные events
    const eventsGroupedByDay = groupEventsByDay(events);

    if (events.length === 0) {
      this._renderNoEvents();
      return;
    }

    if (events.length > 0) {
      this._renderSort();

      // два метода рендера - _renderEventsByDay, _renderEvents. используют разный source (сгруппированный по дням, обычнй массив)
      // сделаеть проверку на _currentSortType чтобы в сорт хендлере можно было перевызывать _renderTrip
      if (this._currentSortType === SORT_TYPE.EVENT) {
        this._renderEventsByDay(eventsGroupedByDay);
        return;
      }

      this._renderEvents(null, 0, events); // базовый рендер точек маршрута, когда нет группировок по дням.
    }
  }
}
