
import {generateEvent} from './mock/event';
import {getTripInfo} from './mock/trip';

import {groupEventsByDay} from './utils/event';
import {renderElement, RenderPosition} from './utils/render';

import SiteMenu from './view/site-menu';
import Filter from './view/filter';
import HeaderTripInfo from './view/header-trip-info';

import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter'

import EventsModel from './models/event';
import FiltersModel from './models/filters';

const EVENT_COUNT = 10;
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filtersModel = new FiltersModel();
console.log(filtersModel);

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
// renderElement(tripControsMakrsElementsArray[1], new Filter(), RenderPosition.AFTEREND);

const mainContentContainerElemant = document.querySelector(`.page-main`);
const tripEventsContainerElement = mainContentContainerElemant.querySelector(`.trip-events`); //main container where events will be drawn

const tripPresenter = new TripPresenter(tripEventsContainerElement, eventsModel, filtersModel);
tripPresenter.init();

new FilterPresenter(tripControsMakrsElementsArray[1], filtersModel, eventsModel).init();


const newTaskButton = document.querySelector(`.trip-main__event-add-btn`);

newTaskButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.addNewEvent();
})


