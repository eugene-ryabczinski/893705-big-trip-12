import Observer from '../utils/observer';

export default class EventsModel extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvents(updateType, update) {
    const index = this._events.findIndex((item) => item.id === update.id);
    if (index > -1) {
      this._events = [
        ...this._events.slice(0, index),
        update,
        ...this._events.slice(index + 1),
      ];

      this._notify(updateType, update);
    }
  }

  addEvent(updateType, update) {
    if (update) {
      this._events = [
        update,
        ...this._events
      ];
    }

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((item) => item.id === update.id);

    if (index > -1) {
      this._events = [
        ...this._events.slice(0, index),
        ...this._events.slice(index + 1)
      ];

      this._notify(updateType, update);
    }
  }


  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          startDate: event.date_from !== null ? new Date(event.date_from) : event.date_from,
          endDate: event.date_to !== null ? new Date(event.date_to) : event.date_to,
          isFavorite: event.is_favorite,
          cost: event.base_price,
          destination: event.destination.name,
          destinationInfo: {...event.destination},
          offers: event.offers.map((offer) => {
            return {
              cost: offer.price,
              name: offer.title,
              isChecked: offer.is_checked
            };
          })
        }
    );

    delete adaptedEvent.date_to;
    delete adaptedEvent.date_from;
    delete adaptedEvent.base_price;
    delete adaptedEvent.is_favorite;
    delete adaptedEvent.destinationInfo.name;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    debugger
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          type: event.type.toLowerCase(),
          base_price: Number(event.cost),
          date_from: event.endDate instanceof Date ? event.startDate.toISOString() : null,
          date_to: event.startDate instanceof Date ? event.endDate.toISOString() : null,
          is_favorite: event.isFavorite,
          destination: {...event.destinationInfo},
          offers: event.offers.map((offer) => {
            return {
              price: Number(offer.cost),
              title: offer.name,
              is_checked: offer.isChecked
            }
          })
        }

    );

    adaptedEvent.destination.name = event.destination;

    delete adaptedEvent.startDate;
    delete adaptedEvent.endDate;
    delete adaptedEvent.isFavorite;
    delete adaptedEvent.cost;
    delete adaptedEvent.destinationInfo;

    return adaptedEvent;
  }
}
