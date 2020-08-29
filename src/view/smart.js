import AbstractView from './abstract-view';

export default class Smart extends AbstractView {
  constructor() {
    super();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;
    this.restoreHandlers();
  }

  updateData(update, onlyData) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (onlyData) {
      return;
    }
    this.updateElement();
  }
}
