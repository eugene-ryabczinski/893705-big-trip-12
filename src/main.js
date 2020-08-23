import { groupBy } from './utils/common';
import { renderElement, RenderPosition, replace } from './utils/render';
import { generateEvent } from './mock/event';
import { getTripInfo } from './mock/trip';
import moment from 'moment';

import SiteMenu from './view/site-menu';
import Filter from './view/filter';
import HeaderTripInfo from './view/header-trip-info';
import Sort from './view/sort';
import TripDaysList from './view/trip-days-list';
import TripDayItem from './view/trip-day-item';
import TripEventsList from './view/trip-events-list';
import TripEventItem from './view/trip-event-Item';
import TripEventItemEdit from './view/trip-event-item-edit';
import NoEvents from './view/no-events';

const groupEventsByDay = (events) => {
  const sortedDates = events.slice();

  sortedDates
    .sort((event, event2) => {
      const date1 = event.endDate;
      const date2 = event2.startDate;
  
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
    return 0;
    })
    
    const groupedByDates = groupBy(sortedDates, item => {
      return moment(item.startDate).startOf(`day`).format()
    })

    return groupedByDates;
}

const EVENT_COUNT = 10;
const events = new Array(EVENT_COUNT).fill().map(generateEvent);
const groupedByDay = groupEventsByDay(events);
const tripInfo = getTripInfo(groupedByDay);

const siteHeaderElement = document.querySelector(`.page-header`);
const headerTripContainerElement = siteHeaderElement.querySelector(`.trip-main`);
const headerTripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);

if (events.length !== 0) {
  renderElement(headerTripContainerElement, new HeaderTripInfo(tripInfo), RenderPosition.AFTERBEGIN);
}

const tripControsMakrsElements = headerTripControlsElement.querySelectorAll(`h2`);
const tripControsMakrsElementsArray = [...tripControsMakrsElements];

renderElement(tripControsMakrsElementsArray[0], new SiteMenu(), RenderPosition.AFTEREND);
renderElement(tripControsMakrsElementsArray[1], new Filter(), RenderPosition.AFTEREND);

const mainContentContainerElemant = document.querySelector(`.page-main`);
const tripEventsContainerElement = mainContentContainerElemant.querySelector(`.trip-events`);

renderElement(tripEventsContainerElement, new Sort(), RenderPosition.BEFOREEND);
renderElement(tripEventsContainerElement, new TripEventItemEdit(), RenderPosition.BEFOREEND);
renderElement(tripEventsContainerElement, new TripDaysList(), RenderPosition.BEFOREEND);

const daysListContainerElement = mainContentContainerElemant.querySelector(`.trip-days`);

const renderEvent = (eventsListElement ,event) => {
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
  }
  
  eventComponent.setRollupEventClickHandler(() => {
    replaceEventToForm();
    document.addEventListener(`keydown`, onEsc)
  })

  eventEditComponent.setFormSubmitHandler((evt) => {
    replaceFormToEvent();
  })
    
  renderElement(eventsListElement, eventComponent, RenderPosition.BEFOREEND);
}

const renderEventsByDay = (groupedByDay) => {
  Object.entries(groupedByDay).forEach(([day, events], index) => {
    renderElement(daysListContainerElement, new TripDayItem(day, index + 1), RenderPosition.BEFOREEND);

    const dayItemElement = Array.from(mainContentContainerElemant.querySelectorAll(`.trip-days__item`))[index]

    renderElement(dayItemElement, new TripEventsList(), RenderPosition.BEFOREEND);
  
    const eventsListElement = dayItemElement.querySelector(`.trip-events__list`);
    
    events.forEach(event => {
      renderEvent(eventsListElement, event)
    })
  })
}

if (events.length === 0) {
  renderElement(tripEventsContainerElement, new NoEvents(), RenderPosition.BEFOREEND);
} else {
  renderEventsByDay(groupedByDay);
}
