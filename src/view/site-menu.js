import AbstractView from './abstract-view';
import {MENU} from '../const';

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-value="${MENU.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-value="${MENU.STATISTIC}">Stats</a>
    </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    const menuButtons = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    menuButtons.forEach((element) => {
      element.addEventListener(`click`, this._menuClickHandler);
    });
  }

  setActiveMenu(selected) {
    const menuButtons = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    Array.from(menuButtons).map((item) => {
      item.classList.remove(`trip-tabs__btn--active`);
      return item;
    }).map((item) => {
      if (item.dataset === selected) {
        item.classList.add(`trip-tabs__btn--active`);
      }
    });
  }
}
