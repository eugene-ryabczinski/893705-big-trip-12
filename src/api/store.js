export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    // this._storeKey = key;
  }

  getItems(entityKey) {
    // debugger
    try { // зачем обёрнуто в try catch
      // return JSON.parse(this._storage.getItem(this._storeKey)) || {};
      return JSON.parse(this._storage.getItem(entityKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(entityKey, items) {
    // what for?
    // debugger
    this._storage.setItem(
        // this._storeKey,
        entityKey,
        JSON.stringify(items)
    );
  }

  setItem(entityKey, key, value) {
    // debugger
    const store = this.getItems(entityKey);

    this._storage.setItem(
      entityKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  removeItem(entityKey, key) {
    // debugger
    const store = this.getItems(entityKey);

    delete store[key];

    this._storage.setItem(
      entityKey,
        // this._storeKey,
        JSON.stringify(store)
    );
  }
}