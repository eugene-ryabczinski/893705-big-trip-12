import { render } from './util';
import { generateEvent } from './mock/event'

import { createHeaderTripInfo } from './view/header-trip-info';
import { createSiteMenuTemplate } from './view/site-menu';
import { createFilterTemplate } from './view/filter';
import { createSortTemplate } from './view/sort';
import { createTripDaysListTemplate } from './view/trip-days-list';
import { createTripDayItemTemplate } from './view/trip-day-item';
import { createTripEventsListTemplate } from './view/trip-events-list';
import { createTripEventItemTemplate } from './view/trip-event-Item';
import { createTripEventItemEditTemplate } from './view/trip-event-item-edit';

const EVENT_COUNT = 10;
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const siteHeaderElement = document.querySelector(`.page-header`);
const headerTripContainerElement = siteHeaderElement.querySelector(`.trip-main`);
const headerTripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);

render(headerTripContainerElement, createHeaderTripInfo(), `afterbegin`);

const tripControsMakrsElements = headerTripControlsElement.querySelectorAll(`h2`);
const tripControsMakrsElementsArray = [...tripControsMakrsElements];

render(tripControsMakrsElementsArray[0], createSiteMenuTemplate(), `afterend`);
render(tripControsMakrsElementsArray[1], createFilterTemplate(), `afterend`);

const mainContentContainerElemant = document.querySelector(`.page-main`);
const tripEventsContainerElement = mainContentContainerElemant.querySelector(`.trip-events`);

render(tripEventsContainerElement, createSortTemplate(), `beforeend`);
render(tripEventsContainerElement, createTripEventItemEditTemplate(events[0]), `beforeend`);
render(tripEventsContainerElement, createTripDaysListTemplate(), `beforeend`);

const daysListElement = mainContentContainerElemant.querySelector(`.trip-days`);

render(daysListElement, createTripDayItemTemplate(), `beforeend`);

const dayItemElement = mainContentContainerElemant.querySelector(`.trip-days__item`);

render(dayItemElement, createTripEventsListTemplate(), `beforeend`);

const eventsListElement = dayItemElement.querySelector(`.trip-events__list`);

for (let i = 1; i < EVENT_COUNT; i++) {
  render(eventsListElement, createTripEventItemTemplate(events[i]), `beforeend`);
}