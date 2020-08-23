import {renderElement, RenderPosition, replace} from '../utils/render';
import {groupEventsByDay} from '../utils/event';

import Sort from '../view/sort';
import TripDaysList from '../view/trip-days-list';
import TripDayItem from '../view/trip-day-item';
import TripEventsList from '../view/trip-events-list';
import TripEventItem from '../view/trip-event-Item';
import TripEventItemEdit from '../view/trip-event-item-edit';
import NoEvents from '../view/no-events';

export default class Trip {
  constructor(tripEventsContainerElement) {
    this._tripEventsContainerElement = tripEventsContainerElement;

    this._sortComponent = new Sort();

    this._tripDaysListComponent = new TripDaysList();
    this._tripDayItemComponent = new TripDayItem();

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

    renderElement(this._tripEventsContainerElement, this._tripDaysListComponent, RenderPosition.BEFOREEND); // render main events container

    this._renderTrip(this._events);
  }

  _sortChangeHandler(event) {
    // implement handler
  }

  _renderSort() {
    renderElement(this._tripEventsContainerElement, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortChangeHandler(this._sortChangeHandler);
  }

  _renderNoEvents() {
    renderElement(this._tripEventsContainerElement, new NoEvents(), RenderPosition.BEFOREEND);
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

  _renderEventsByDay(eventsGroupedByDay) {
    const daysListContainerElement = this._tripEventsContainerElement.querySelector(`.trip-days`);

    Object.entries(eventsGroupedByDay).forEach(([day, events], index) => {
      renderElement(daysListContainerElement, new TripDayItem(day, index + 1), RenderPosition.BEFOREEND);

      const dayItemElement = Array.from(daysListContainerElement.querySelectorAll(`.trip-days__item`))[index];

      renderElement(dayItemElement, new TripEventsList(), RenderPosition.BEFOREEND);

      const eventsListElement = dayItemElement.querySelector(`.trip-events__list`);

      events.forEach((event) => {
        this._renderEvent(eventsListElement, event);
      });
    });
  }

  _renderTrip(events) {
    // render main trip content
    if (events.length === 0) {
      this._renderNoEvents();
    } else {
      this._renderEventsByDay(this._eventsGroupedByDay);
    }
  }
}
