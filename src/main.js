
import "../node_modules/flatpickr/dist/themes/material_blue.css";

import {generateEvent} from './mock/event';
import {renderElement, RenderPosition} from './utils/render';

import SiteMenu from './view/site-menu';

import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';

import EventsModel from './models/event';
import FiltersModel from './models/filters';

const EVENT_COUNT = 10;
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filtersModel = new FiltersModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const headerTripContainerElement = siteHeaderElement.querySelector(`.trip-main`);
const headerTripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);


const tripInfoPresenter = new TripInfoPresenter(headerTripContainerElement, eventsModel);
tripInfoPresenter.init(events);

const tripControsMakrsElements = headerTripControlsElement.querySelectorAll(`h2`);
const tripControsMakrsElementsArray = [...tripControsMakrsElements];

renderElement(tripControsMakrsElementsArray[0], new SiteMenu(), RenderPosition.AFTEREND);

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
