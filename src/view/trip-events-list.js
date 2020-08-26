import AbstractView from './abstract-view';

const createTripEventsListTemplate = () => {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
};

export default class TripEventsList extends AbstractView {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
