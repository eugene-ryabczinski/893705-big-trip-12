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

import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
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
const tripPresenter = new TripPresenter(tripEventsContainerElement, eventsModel, filtersModel, destinationsModel, offersModel, apiWithProvider);
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
  apiWithProvider.getPoints(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getOffers(),
])
.then((response) => {
  const points = response[0];
  const destinations = response[1];
  const offers = response[2];
  offersModel.setOffers(null, offers);
  destinationsModel.setDestinations(null, destinations);
  eventsModel.setEvents(UPDATE_TYPE.INIT, points);
})
.catch(() => {
  offersModel.setOffers(null, []);
  destinationsModel.setDestinations(null, []);
  eventsModel.setEvents(UPDATE_TYPE.INIT, []);
})

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
