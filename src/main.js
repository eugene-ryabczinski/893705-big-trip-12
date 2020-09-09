import "../node_modules/flatpickr/dist/themes/material_blue.css";

import {generateEvent} from './mock/event';

import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import MenuPresenter from './presenter/menu';

import EventsModel from './models/event';
import FiltersModel from './models/filters';

import {UPDATE_TYPE} from './const';

import Api from "./api.js";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);
const EVENT_COUNT = 1;
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const eventsModel = new EventsModel();
const filtersModel = new FiltersModel();

// elements
const siteHeaderElement = document.querySelector(`.page-header`);
const headerTripContainerElement = siteHeaderElement.querySelector(`.trip-main`);
const headerTripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);

const newTaskButton = document.querySelector(`.trip-main__event-add-btn`);

const tripControsMakrsElements = headerTripControlsElement.querySelectorAll(`h2`);
const tripControsMakrsElementsArray = [...tripControsMakrsElements];

const mainContentContainerElemant = document.querySelector(`.page-main`);
const tripEventsContainerElement = mainContentContainerElemant.querySelector(`.trip-events`); //main container where events will be drawn

// presenters
const tripInfoPresenter = new TripInfoPresenter(headerTripContainerElement, eventsModel);
const tripPresenter = new TripPresenter(tripEventsContainerElement, eventsModel, filtersModel);

renderElement(tripControsMakrsElementsArray[0], new SiteMenu(), RenderPosition.AFTEREND);

tripInfoPresenter.init(events);
tripPresenter.init();
new FilterPresenter(tripControsMakrsElementsArray[1], filtersModel, eventsModel).init();

newTaskButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.addNewEvent();
})

api.getPoints()
  .then((point) => {
    eventsModel.setEvents(UPDATE_TYPE.INIT, point);
  })
  .catch(() => {
    eventsModel.setEvents(UPDATE_TYPE.INIT, []);
  });
