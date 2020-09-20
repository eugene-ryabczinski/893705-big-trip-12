import {nanoid} from "nanoid";
import EventsModel from "../models/event";

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
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
    debugger
    // return this._api.getPoints();
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          debugger
          const items = createStoreStructure(points.map(EventsModel.adaptToServer));
          this._store.setItems(items);
          return points;
        });
    }

    const storeTasks = Object.values(this._store.getItems());

    return Promise.resolve(storeTasks.map(EventsModel.adaptToClient));
  }

  updatePoint(pint) {
    return this._api.updateTask(task);
    // if (Provider.isOnline()) {
    //   return this._api.updatePoint(task)
    //     .then((updatedTask) => {
    //       this._store.setItem(updatedTask.id, EventsModel.adaptToServer(updatedTask));
    //       return updatedTask;
    //     });
    // }

    // this._store.setItem(task.id, EventsModel.adaptToServer(Object.assign({}, task)));

    // return Promise.resolve(task);
  }

  addPoint(point) {
    return this._api.addPoint(point);
    if (Provider.isOnline()) {
      return this._api.addTask(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, EventsModel.adaptToServer(newPoint));
          return newTask;
        });
    }

    // На случай локального создания данных мы должны сами создать `id`.
    // Иначе наша модель будет не полной, и это может привнести баги
    const localNewTaskId = nanoid();
    const localNewTask = Object.assign({}, task, {id: localNewTaskId});

    this._store.setItem(localNewTask.id, EventsModel.adaptToServer(localNewTask));

    return Promise.resolve(localNewTask);
  }

  deletePoint(point) {
    return this._api.deletePoint(point)
    if (Provider.isOnline()) {
      return this._api.deletePoint(task)
        .then(() => this._store.removeItem(task.id));
    }

    this._store.removeItem(task.id);

    return Promise.resolve();
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  getOffers() {
    return this._api.getOffers();
  }

  // sync() {
  //   if (Provider.isOnline()) {
  //     const storeTasks = Object.values(this._store.getItems());

  //     return this._api.sync(storeTasks)
  //       .then((response) => {
  //         // Забираем из ответа синхронизированные задачи
  //         const createdTasks = getSyncedTasks(response.created);
  //         const updatedTasks = getSyncedTasks(response.updated);

  //         // Добавляем синхронизированные задачи в хранилище.
  //         // Хранилище должно быть актуальным в любой момент.
  //         const items = createStoreStructure([...createdTasks, ...updatedTasks]);

  //         this._store.setItems(items);
  //       });
  //   }

  //   return Promise.reject(new Error(`Sync data failed`));
  // }

  static isOnline() {
    return window.navigator.onLine;
  }
}