import {SORT_TYPE, USER_ACTION, UPDATE_TYPE, FILTER_TYPE} from '../const';
import {renderElement, RenderPosition, removeCommponent} from '../utils/render';
import {groupEventsByDay, sortByDuration, sortByPrice, filter} from '../utils/event';
import {updateItem} from '../utils/common';

import Sort from '../view/sort';
import TripDaysList from '../view/trip-days-list';
import TripDayItem from '../view/trip-day-item';
import TripEventsList from '../view/trip-events-list';
import TripEventItem from '../view/trip-event-Item';
import TripEventItemEdit from '../view/trip-event-item-edit';
import NoEvents from '../view/no-events';
import Event from '../presenter/event';
import EventNew from '../presenter/eventNew';

export default class TripPresenter {
  constructor(tripEventsMainContainerElement, eventsModel, filterModel) {
    this._tripEventsMainContainerElement = tripEventsMainContainerElement;

    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

    this._sortComponent = new Sort();
    this._tripDaysListComponent = new TripDaysList();
    this._tripEventsListComponent = new TripEventsList();
    this._tripEventItemComponent = new TripEventItem();
    this._tripEventItemEditComponent = new TripEventItemEdit();
    this._noEventsComponent = null; // запретить рендерить компонент несколько раз в renderTrip

    this._eventPresenter = {};
    this._currentSortType = SORT_TYPE.EVENT;

    this._sortChangeHandler = this._sortChangeHandler.bind(this);
    // this._handleEventChange = this._handleEventChange.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._newEventPresenter = new EventNew(this._tripEventsMainContainerElement, this._handleViewAction, this._eventsModel); //передаём модель? т.к. от кол-ва ивентов будет зависить куда рендерить форму
  }

  init() {
    this._renderTrip();
  }
  
  addNewEvent() {
    this._currentSortType = SORT_TYPE.EVENT; // reset
    this._filterModel.setFilter(UPDATE_TYPE.MINOR, FILTER_TYPE.EVERYTHING); // reset

    if (this._noEventsComponent) {
      removeCommponent(this._noEventsComponent);
      this._noEventsComponent = null;
    }

    this._newEventPresenter.init();
  }

  _getEvents() { // почему вся логика в getTasks?
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SORT_TYPE.EVENT:
        return filteredEvents;
      case SORT_TYPE.TIME:
        return filteredEvents.sort(sortByDuration);
      case SORT_TYPE.PRICE:
        return filteredEvents.sort(sortByPrice);
    }
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => {
        presenter.resetView();
      });
  }

  _handleViewAction(actionType, updateType, updatedEvent) { //check what this for. relate with _handleModelEvent?
    // console.log(actionType, updateType, updatedEvent);
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

  // сабскрайб на изменение модели => перерисовываем ивент или весь лист
  _handleModelEvent(updateType, data) { //check what this for. relate with _handleViewAction?
    switch (updateType) {
      case UPDATE_TYPE.PATCH: // обновить только одну точку маршрута
        this._eventPresenter[data.id].init(data);
        break;
      case UPDATE_TYPE.MINOR: // перерисовать весь список
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
    renderElement(this._tripEventsMainContainerElement, this._noEventsComponent, RenderPosition.BEFOREEND);
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
    const events = this._getEvents(); // завязываемся на модель. в _getEvents получаем отсортированные events
    const eventsGroupedByDay = groupEventsByDay(events);

    if (events.length === 0 && !this._noEventsComponent) { // и нет активной формы создания точки маршрута
      this._noEventsComponent = new NoEvents();
      this._renderNoEvents();
      removeCommponent(this._sortComponent);
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
