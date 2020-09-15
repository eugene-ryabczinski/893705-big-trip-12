import "../node_modules/flatpickr/dist/themes/material_blue.css";

import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import MenuPresenter from './presenter/menu';

import EventsModel from './models/event';
import FiltersModel from './models/filters';
import DestinationsModel from './models/destinations';
import OffersModel from './models/offers';

import {UPDATE_TYPE} from './const';

import Api from "./api.js";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

// models
const eventsModel = new EventsModel();
const filtersModel = new FiltersModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

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
const tripPresenter = new TripPresenter(tripEventsContainerElement, eventsModel, filtersModel, destinationsModel, offersModel, api);
const menuPresenter = new MenuPresenter(tripControsMakrsElementsArray[0], tripEventsContainerElement, tripPresenter, eventsModel);
const filterPresenter = new FilterPresenter(tripControsMakrsElementsArray[1], filtersModel, eventsModel);


tripInfoPresenter.init();
menuPresenter.init();
tripPresenter.init();
filterPresenter.init();


const handleNewEventFormClose = (evt) => {
  newTaskButton.removeAttribute(`disabled`);
}



newTaskButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.addNewEvent(handleNewEventFormClose);
  newTaskButton.setAttribute(`disabled`, `disabled`);
})

Promise.all([
  api.getPoints(),
  api.getDestinations(),
  api.getOffers(),
])
.then((response) => {
  const points = response[0];
  const destinations = response[1];
  const offers = response[2];
  offersModel.setOffers(null, offers);
  destinationsModel.setDestinations(null, destinations);
  eventsModel.setEvents(UPDATE_TYPE.INIT, points);
  console.log(points)
})
