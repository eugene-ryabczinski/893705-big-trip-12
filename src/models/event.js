import Observer from '../utils/observer';

export default class EventsModel extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(events) {
    this._events = events.slice();
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

  addEvent(update, updateType) {
    this._tasks = [
      update,
      ...this._events
    ];

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
}
