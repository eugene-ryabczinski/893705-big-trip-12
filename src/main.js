"use strict"

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

//header
const siteHeaderElement = document.querySelector(`.page-header`);
const headerTripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);

//main content
const mainContentContainerElemant = document.querySelector(`.page-main`);
const pageBodyElemant = mainContentContainerElemant.querySelector(`.page-body__container`);

const createSiteMenuTemplate = () => {
  return (`
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>
  `)
}

const createFilterTemplate = () => {
  return (
    `<h2 class="visually-hidden">Switch trip view</h2>
    <form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  )
}

const createSortTemplate = () => {
  return (
    `<h2 class="visually-hidden">Filter events</h2>
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>
  
    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" checked>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>
  
    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
      <label class="trip-sort__btn" for="sort-time">
        Time
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>
  
    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
      <label class="trip-sort__btn" for="sort-price">
        Price
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>
  
    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
  </form>`)
}

const createTripEventsTemplate = () => {
  return (
    `<section class="trip-events">
        <h2 class="visually-hidden">Trip events</h2>

        <!-- Сортировка -->

        <!-- Контент -->
      </section>
    `
  )
}

const createTripDaysListTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  )
}

const createTripDayItemTemplate = () => {
  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">MAR 18</time>
      </div>
    </li>`
  )
}

const createTripEventsListTemplate = () => {
  return (
    `<ul class="trip-events__list">
    </ul>`
    )
}

const createTripEventItemTemplate = () => {
  return (
    `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
      </div>
      <h3 class="event__title">Taxi to Amsterdam</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
        </p>
        <p class="event__duration">30M</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">20</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        <li class="event__offer">
          <span class="event__offer-title">Order Uber</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">20</span>
         </li>
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  )
}

render(headerTripControlsElement, createSiteMenuTemplate(), `beforeend`);
render(headerTripControlsElement, createFilterTemplate(), `beforeend`);
render(pageBodyElemant, createTripEventsTemplate(), `beforeend`);

const tripEventsContainerElement = mainContentContainerElemant.querySelector(`.trip-events`);

render(tripEventsContainerElement, createSortTemplate(), `beforeend`);
render(tripEventsContainerElement, createTripDaysListTemplate(), `beforeend`);

const daysListElement = mainContentContainerElemant.querySelector(`.trip-days`);

render(daysListElement, createTripDayItemTemplate(), `beforeend`);

const dayItemElement = mainContentContainerElemant.querySelector(`.trip-days__item`);

render(dayItemElement, createTripEventsListTemplate(), `beforeend`);

const eventsListElement = dayItemElement.querySelector(`.trip-events__list`);

render(eventsListElement, createTripEventItemTemplate(), `beforeend`);



