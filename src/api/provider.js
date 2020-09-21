import {nanoid} from "nanoid";
import EventsModel from "../models/event";
import OffersModel from "../models/offers";

const STORE_VER = `v12`;
const STORE_PREFIX = `bigtrip-localstorage`;

export const STORAGE_KEYS = {
  POINTS: `${STORE_PREFIX}-points-${STORE_VER}`,
  OFFERS: `${STORE_PREFIX}-offers-${STORE_VER}`,
  DESTIATIONS: `${STORE_PREFIX}-destinations-${STORE_VER}`,
}

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    // debugger
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    // debugger
    // return this._api.getPoints();
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(EventsModel.adaptToServer));
          this._store.setItems(STORAGE_KEYS.POINTS, items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems(STORAGE_KEYS.POINTS));

    return Promise.resolve(storePoints.map(EventsModel.adaptToClient));
  }

  updatePoint(point) {
    if (Provider.isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, EventsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }
    // debugger

    this._store.setItem(STORAGE_KEYS.POINTS, point.id, EventsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    // return this._api.addPoint(point);
    if (Provider.isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, EventsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }
// debugger
    // На случай локального создания данных мы должны сами создать `id`.
    // Иначе наша модель будет не полной, и это может привнести баги
    const localNewEventId = nanoid();
    const localNewEvent = Object.assign({}, point, {id: localNewEventId});

    this._store.setItem(STORAGE_KEYS.POINTS, localNewEvent.id, EventsModel.adaptToServer(localNewEvent));

    return Promise.resolve(localNewEvent);
  }

  deletePoint(point) {
    // return this._api.deletePoint(point)
    if (Provider.isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(STORAGE_KEYS.POINTS, point.id));
    }
    // debugger
    this._store.removeItem(STORAGE_KEYS.POINTS, point.id);

    return Promise.resolve(point);
  }

  getDestinations() {
    // return this._api.getDestinations();
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          // debugger
          // const items = createStoreStructure(destinations);
          this._store.setItems(STORAGE_KEYS.DESTIATIONS, destinations);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getItems(STORAGE_KEYS.DESTIATIONS));

    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    // return this._api.getOffers();
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          // debugger
          // const items = createStoreStructure(offers);
          // const p = offers.map(OffersModel.adaptToServer);
          this._store.setItems(STORAGE_KEYS.OFFERS, offers);
          return offers;
        });
    }
    // debugger

    const storeOffers = Object.values(this._store.getItems(STORAGE_KEYS.OFFERS));

    // return Promise.resolve(storeOffers.map(OffersModel.adaptToClient));
    return Promise.resolve(storeOffers);
  }

  sync() { 
    if (Provider.isOnline()) {
      // debugger
      const storePoints = Object.values(this._store.getItems(STORAGE_KEYS.POINTS));

      return this._api.sync(storePoints)
        .then((response) => {
          // debugger
          // Забираем из ответа синхронизированные задачи
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}