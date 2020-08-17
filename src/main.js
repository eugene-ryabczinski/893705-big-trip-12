import { render, groupBy } from './utils';
import { generateEvent } from './mock/event';
import { getTripInfo } from './mock/trip';
import moment from 'moment';

import { createHeaderTripInfo } from './view/header-trip-info';
import { createSiteMenuTemplate } from './view/site-menu';
import { createFilterTemplate } from './view/filter';
import { createSortTemplate } from './view/sort';
import { createTripDaysListTemplate } from './view/trip-days-list';
import { createTripDayItemTemplate } from './view/trip-day-item';
import { createTripEventsListTemplate } from './view/trip-events-list';
import { createTripEventItemTemplate } from './view/trip-event-Item';
import { createTripEventItemEditTemplate } from './view/trip-event-item-edit';

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

render(headerTripContainerElement, createHeaderTripInfo(tripInfo), `afterbegin`);

const tripControsMakrsElements = headerTripControlsElement.querySelectorAll(`h2`);
const tripControsMakrsElementsArray = [...tripControsMakrsElements];

render(tripControsMakrsElementsArray[0], createSiteMenuTemplate(), `afterend`);
render(tripControsMakrsElementsArray[1], createFilterTemplate(), `afterend`);

const mainContentContainerElemant = document.querySelector(`.page-main`);
const tripEventsContainerElement = mainContentContainerElemant.querySelector(`.trip-events`);

render(tripEventsContainerElement, createSortTemplate(), `beforeend`);
render(tripEventsContainerElement, createTripEventItemEditTemplate(events[0]), `beforeend`);
render(tripEventsContainerElement, createTripDaysListTemplate(), `beforeend`);

const daysListContainerElement = mainContentContainerElemant.querySelector(`.trip-days`);

const renderEventsByDay = (groupedByDay) => {
  Object.entries(groupedByDay).forEach(([day, events], index) => {
    render(daysListContainerElement, createTripDayItemTemplate(day, index + 1), `beforeend`);
  
    const dayItemElement = Array.from(mainContentContainerElemant.querySelectorAll(`.trip-days__item`))[index]
  
    render(dayItemElement, createTripEventsListTemplate(), `beforeend`);
  
    const eventsListElement = dayItemElement.querySelector(`.trip-events__list`);
    
    events.forEach(event => {
      render(eventsListElement, createTripEventItemTemplate(event), `beforeend`);
    })
  })
}

renderEventsByDay(groupedByDay);
