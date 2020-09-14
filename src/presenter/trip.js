import {SORT_TYPE, USER_ACTION, UPDATE_TYPE, FILTER_TYPE} from '../const';
import {renderElement, RenderPosition, removeCommponent} from '../utils/render';
import {groupEventsByDay, sortByDuration, sortByPrice, filter} from '../utils/event';

import Sort from '../view/sort';
import TripDaysList from '../view/trip-days-list';
import TripDayItem from '../view/trip-day-item';
import TripEventsList from '../view/trip-events-list';
import TripEventItem from '../view/trip-event-Item';
import NoEvents from '../view/no-events';
import Loading from '../view/loading';
import Event from '../presenter/event';
import EventNew from '../presenter/eventNew';
import { remove } from 'lodash';

export default class TripPresenter {
  constructor(tripEventsMainContainerElement, eventsModel, filterModel, destinationsModel, offersModel, api) {
    this._tripEventsMainContainerElement = tripEventsMainContainerElement;

    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._offers = [];
    this._destinations = [];
    // console.log(this._eventsModel.getEvents());
    // console.log(this._destinationsModel.getDestinations());
    // console.log(this._offersModel.getOffers());
    this._api = api;

    this._isLoading = true;

    this._sortComponent = new Sort();
    this._tripDaysListComponent = new TripDaysList();
    this._tripEventsListComponent = new TripEventsList();
    this._tripEventItemComponent = new TripEventItem();
    this._noEventsComponent = null; // запретить рендерить _noEventsComponent компонент несколько раз в renderTrip
    this._loadingComponent = new Loading();

    this._eventPresenter = {};
    this._currentSortType = SORT_TYPE.EVENT;

    this._sortChangeHandler = this._sortChangeHandler.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

<<<<<<< HEAD
    this._newEventPresenter = new EventNew(this._tripEventsMainContainerElement, this._handleViewAction, this._handleModeChange, this._eventsModel); // передаём модель? т.к. от кол-ва ивентов будет зависить куда рендерить форму
=======
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._newEventPresenter = new EventNew(this._tripEventsMainContainerElement, this._handleViewAction, this._handleModeChange); // передаём модель? т.к. от кол-ва ивентов будет зависить куда рендерить форму
>>>>>>> implement update, delete, add
  }

  init() {
    this._renderTrip();
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

  }

  destroy() {
    removeCommponent(this._sortComponent);
    if (this._noEventsComponent) {
      removeCommponent(this._noEventsComponent);
    }
    this._clearEventList();
    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  addNewEvent(onCloseCallback) {
    this._currentSortType = SORT_TYPE.EVENT; // reset
    this._filterModel.setFilter(UPDATE_TYPE.MINOR, FILTER_TYPE.EVERYTHING); // reset

    if (this._noEventsComponent) {
      removeCommponent(this._noEventsComponent);
      this._noEventsComponent = null;
    }

    const events = this._eventsModel.getEvents();
    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();

    const newEventPresenter = this._newEventPresenter;
<<<<<<< HEAD
    newEventPresenter.init(onCloseCallback);
=======
    newEventPresenter.init(events, offers, destinations);
    // this._tripEventItemEditComponent = new TripEventItemEdit(event, this._offers, this._destinations);
>>>>>>> implement update, delete, add
    this._eventPresenter[`0`] = newEventPresenter;
  }

  _getEvents() { // вся логика в getTasks
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
    return filteredEvents; // error  Method '_getEvents' expected a return value linter
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => {
        presenter.resetView();
      });
  }

  _handleViewAction(actionType, updateType, updatedEvent) {
    switch (actionType) {
      case USER_ACTION.UPDATE_EVENT:

        this._api.updatePoint(updatedEvent).then((response) => {
          this._eventsModel.updateEvents(updateType, response);
        });
        break;
      case USER_ACTION.ADD_EVENT:
        this._api.addPoint(updatedEvent).then((response) => {
          this._eventsModel.addEvent(updateType, response);
        });
        // this._eventsModel.addEvent(updateType, updatedEvent);
        break;
      case USER_ACTION.DELETE_EVENT:
        this._api.deletePoint(updatedEvent).then(() => {
          this._eventsModel.deleteEvent(updateType, updatedEvent);
        });
        // this._eventsModel.deleteEvent(updateType, updatedEvent);
        break;
    }
  }

  // сабскрайб на изменение модели => перерисовываем ивент или весь лист
  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UPDATE_TYPE.PATCH: // обновить только одну точку маршрута
        this._eventPresenter[data.id].init(data, this._offersModel.getOffers(), this._destinationsModel.getDestinations()); // обращаемся к локальным переменным? нужно к модели?
        break;
      case UPDATE_TYPE.MINOR: // перерисовать весь список
        this._clearEventList();
        this._renderTrip();
        break;
      case UPDATE_TYPE.MAJOR:
        break;
      case UPDATE_TYPE.INIT:
        this._isLoading = false;
        removeCommponent(this._loadingComponent);
        this._renderTrip();
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
    removeCommponent(this._loadingComponent);
  }

  _renderSort() {
    renderElement(this._tripEventsMainContainerElement, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortChangeHandler(this._sortChangeHandler);
  }

  _renderNoEvents() {
    renderElement(this._tripEventsMainContainerElement, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    renderElement(this._tripEventsMainContainerElement, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(eventsListElement, event, offers, destinations) {
    const eventPresenter = new Event(eventsListElement, this._handleViewAction, this._handleModeChange, this._offersModel, this._destinationsModel);
    eventPresenter.init(event, offers, destinations);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents(dayDate, count, events, offers, destinations) {
    renderElement(this._tripEventsMainContainerElement, this._tripDaysListComponent, RenderPosition.BEFOREEND);
    const tripDayItemComponent = new TripDayItem(dayDate, count);
    renderElement(this._tripDaysListComponent, tripDayItemComponent, RenderPosition.BEFOREEND);

    const tripEventsListComponent = new TripEventsList();
    renderElement(tripDayItemComponent, tripEventsListComponent, RenderPosition.BEFOREEND);

    events.forEach((event) => {
      this._renderEvent(tripEventsListComponent, event, offers, destinations);
    });
  }

  _renderEventsByDay(eventsGroupedByDay, offers, destinations) {
    Object.entries(eventsGroupedByDay).forEach(([day, events], index) => {
      this._renderEvents(day, index + 1, events, offers, destinations);
    });
  }

  _renderTrip() { // todo: рефакторинг условий
    if (this._isLoading) {
      this._renderLoading();
      return
    }

    const events = this._getEvents(); // завязываемся на модель. в _getEvents получаем отсортированные events
    const eventsGroupedByDay = groupEventsByDay(events);
    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();

    if (this._eventsModel.getEvents().length === 0 && !this._noEventsComponent) {
      this._noEventsComponent = new NoEvents();
      this._renderNoEvents();
      removeCommponent(this._sortComponent);
      return;
    }

    if (events.length === 0) {
      removeCommponent(this._sortComponent);
    }

    if (events.length > 0) {
      if (this._noEventsComponent) {
        removeCommponent(this._noEventsComponent);
        this._noEventsComponent = null;
      }

      this._renderSort();

      // два метода рендера - _renderEventsByDay, _renderEvents. используют разный source (сгруппированный по дням, обычнй массив)
      if (this._currentSortType === SORT_TYPE.EVENT) {
        this._renderEventsByDay(eventsGroupedByDay, offers, destinations);
        return;
      }

      this._renderEvents(null, 0, events, offers, destinations); // базовый рендер точек маршрута, когда нет группировок по дням.
    }
  }
}
