import {SORT_TYPE} from '../const';
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
  constructor(tripEventsMainContainerElement) {
    this._tripEventsMainContainerElement = tripEventsMainContainerElement;

    this._sortComponent = new Sort();
    this._tripDaysListComponent = new TripDaysList();
    this._tripEventsListComponent = new TripEventsList();
    this._tripEventItemComponent = new TripEventItem();
    this._tripEventItemEditComponent = new TripEventItemEdit();
    this._noEventsComponent = new NoEvents();

    this._eventPresenter = {};

    this._sortChangeHandler = this._sortChangeHandler.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._eventsGroupedByDay = groupEventsByDay(this._events);

    if (this._events) {
      this._renderSort();
    }
    this._renderTrip(this._events);
  }

  _handleEventChange(event) {
    this.events = updateItem(event);
    this._eventPresenter[event.id].init(event);
  }

  _sortChangeHandler(event) {
    this._clearEventList();

    switch (event) {
      case SORT_TYPE.EVENT:
        this._renderEventsByDay(this._eventsGroupedByDay);
        break;
      case SORT_TYPE.TIME:
        this._events.sort(sortByDuration);
        this._renderEvents(null, 0, this._events);
        break;
      case SORT_TYPE.PRICE:
        this._events.sort(sortByPrice);
        this._renderEvents(null, 0, this._events);
        break;
    }
  }

  _clearEventList() {
    Object.values(this._eventPresenter).forEach((presenter) => {
      presenter.destroy();
    });
    this._eventPresenter = {};
    removeCommponent(this._tripDaysListComponent); // оставить это здесь?
  }

  _renderSort() {
    renderElement(this._tripEventsMainContainerElement, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortChangeHandler(this._sortChangeHandler);
  }

  _renderNoEvents() {
    renderElement(this._tripEventsMainContainerElement, new NoEvents(), RenderPosition.BEFOREEND);
  }

  _renderEvent(eventsListElement, event) {
    const eventPresenter = new Event(eventsListElement);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents(dayDate, count, events) {
    renderElement(this._tripEventsMainContainerElement, this._tripDaysListComponent, RenderPosition.BEFOREEND); // оставить это здесь?
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

  _renderTrip(events) {
    if (events.length === 0) {
      this._renderNoEvents();
    } else {
      this._renderEventsByDay(this._eventsGroupedByDay);
    }
  }
}
