import Observer from '../utils/observer';

export default class DestinationsModel extends Observer {
  constructor() {
    super();
    this._destinations = null;
  }

  setDestinations(updateType, destinations) {
    this._destinations = destinations;
    this._notify(updateType, destinations);
  }

  getDestinations() {
    return this._destinations;
  }
}
