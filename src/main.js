import "../node_modules/flatpickr/dist/themes/material_blue.css";

import {generateEvent} from './mock/event';

import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import MenuPresenter from './presenter/menu';

import EventsModel from './models/event';
import FiltersModel from './models/filters';



import Api from "./api.js";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

api.getPoints().then((point) => {
  console.log(point);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});








const EVENT_COUNT = 10;
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

console.log(events);

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

const mainContentContainerElemant = document.querySelector(`.page-main`);
const tripEventsContainerElement = mainContentContainerElemant.querySelector(`.trip-events`); //main container where events will be drawn

const tripPresenter = new TripPresenter(tripEventsContainerElement, eventsModel, filtersModel);
const menuPresenter = new MenuPresenter(tripControsMakrsElementsArray[0], tripEventsContainerElement, tripPresenter, eventsModel);
const filterPresenter = new FilterPresenter(tripControsMakrsElementsArray[1], filtersModel, eventsModel);

menuPresenter.init();
tripPresenter.init();
filterPresenter.init();

const newTaskButton = document.querySelector(`.trip-main__event-add-btn`);

newTaskButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.addNewEvent(handleNewEventFormClose);
  newTaskButton.setAttribute(`disabled`, `disabled`);
})