export default class Store {
  constructor(storage) {
    this._storage = storage;
  }

  getItems(entityKey) {
    try {
      return JSON.parse(this._storage.getItem(entityKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(entityKey, items) {
    this._storage.setItem(
        entityKey,
        JSON.stringify(items)
    );
  }

  setItem(entityKey, key, value) {
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
    const store = this.getItems(entityKey);

    delete store[key];

    this._storage.setItem(
        entityKey,
        JSON.stringify(store)
    );
  }
}
