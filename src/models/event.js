import Observer from '../utils/observer';

export default class EventsModel extends Observer {
  constructor() {
    super();
    this._events = [];
    EventsModel.adaptToClient = EventsModel.adaptToClient.bind(this)
  }

  setEvents(updateType, events) {
    // debugger
    this._events = events.slice();
    this._notify(updateType);
    console.log(this._events)
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
    // debugger
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
              price: offer.price,
              name: offer.title
            }
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

  static adaptToServer(task) {
    const adaptedTask = Object.assign(
        {},
        task,
        {
          "due_date": task.dueDate instanceof Date ? task.dueDate.toISOString() : null, // На сервере дата хранится в ISO формате
          "is_archived": task.isArchive,
          "is_favorite": task.isFavorite,
          "repeating_days": task.repeating
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedTask.dueDate;
    delete adaptedTask.isArchive;
    delete adaptedTask.isFavorite;
    delete adaptedTask.repeating;

    return adaptedTask;
  }
}
