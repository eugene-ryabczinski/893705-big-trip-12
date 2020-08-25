import {SortType} from '../const';
import {renderElement, RenderPosition, replace} from '../utils/render';
import {groupEventsByDay, sortByDuration, sortByPrice} from '../utils/event';

import Sort from '../view/sort';
import TripDaysList from '../view/trip-days-list';
import TripDayItem from '../view/trip-day-item';
import TripEventsList from '../view/trip-events-list';
import TripEventItem from '../view/trip-event-Item';
import TripEventItemEdit from '../view/trip-event-item-edit';
import NoEvents from '../view/no-events';

export default class Trip {
  constructor(tripEventsMainContainerElement) {
    this._tripEventsMainContainerElement = tripEventsMainContainerElement;

    this._sortComponent = new Sort();
    this._tripDaysListComponent = new TripDaysList();
    this._tripEventsListComponent = new TripEventsList();
    this._tripEventItemComponent = new TripEventItem();
    this._tripEventItemEditComponent = new TripEventItemEdit();
    this._noEventsComponent = new NoEvents();

    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._eventsGroupedByDay = groupEventsByDay(this._events);

    if (this._events) {
      this._renderSort();
    }

    renderElement(this._tripEventsMainContainerElement, this._tripDaysListComponent, RenderPosition.BEFOREEND); // render main events container

    this._renderTrip(this._events);
  }

  _sortChangeHandler(event) {
    this._clearEventList();

    switch (event) {
      case SortType.EVENT:
        this._renderEventsByDay(this._eventsGroupedByDay);
        break;
      case SortType.TIME:
        this._events.sort(sortByDuration);
        this._renderEvents(null, 0, this._events);
        break;
      case SortType.PRICE:
        this._events.sort(sortByPrice);
        this._renderEvents(null, 0, this._events);
        break;
    }
  }

  _clearEventList() {
    this._tripDaysListComponent.getElement().innerHTML = ``;
  }

  _renderSort() {
    renderElement(this._tripEventsMainContainerElement, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortChangeHandler(this._sortChangeHandler);
  }

  _renderNoEvents() {
    renderElement(this._tripEventsMainContainerElement, new NoEvents(), RenderPosition.BEFOREEND);
  }

  _renderEvent(eventsListElement, event) {
    const eventComponent = new TripEventItem(event);
    const eventEditComponent = new TripEventItemEdit(event);

    const replaceEventToForm = () => replace(eventEditComponent, eventComponent);
    const replaceFormToEvent = () => replace(eventComponent, eventEditComponent);

    const onEsc = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener(`keydown`, onEsc);
      }
    };

    eventComponent.setRollupEventClickHandler(() => {
      replaceEventToForm();
      document.addEventListener(`keydown`, onEsc);
    });

    eventEditComponent.setFormSubmitHandler(() => {
      replaceFormToEvent();
    });

    renderElement(eventsListElement, eventComponent, RenderPosition.BEFOREEND);
  }

  _renderEvents(dayDate, count, events) {
    const tripDayItemComponent = new TripDayItem(dayDate = undefined, count = undefined);
    renderElement(this._tripDaysListComponent, tripDayItemComponent, RenderPosition.BEFOREEND);

    const tripEventsListComponent = new TripEventsList();
    renderElement(tripDayItemComponent, tripEventsListComponent, RenderPosition.BEFOREEND);

    events.forEach((event) => {
      this._renderEvent(tripEventsListComponent.getElement(), event);
    });
  }

  _renderEventsByDay(eventsGroupedByDay) {
    Object.entries(eventsGroupedByDay).forEach(([day, events], index) => {
      this._renderEvents(day, index, events);
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
