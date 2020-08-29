import AbstractView from './abstract-view';

export default class Smart extends AbstractView {
  constructor() {
    super();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  updateElement() {}

  updateData() {}
}
