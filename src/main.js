
import {generateEvent} from './mock/event';
import {getTripInfo} from './mock/trip';

import {groupEventsByDay} from './utils/event';
import {renderElement, RenderPosition} from './utils/render';

import SiteMenu from './view/site-menu';
import Filter from './view/filter';
import HeaderTripInfo from './view/header-trip-info';

import Trip from './presenter/trip';

const EVENT_COUNT = 1;
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
const tripEventsContainerElement = mainContentContainerElemant.querySelector(`.trip-events`); //main container where events will be drawn

new Trip(tripEventsContainerElement).init(events);
