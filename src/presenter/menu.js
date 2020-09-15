import {renderElement, RenderPosition, removeCommponent} from '../utils/render';
import {MENU} from '../const';
import SiteMenu from '../view/site-menu';
import Stats from '../view/stats';

export default class MenuPresenter {
  constructor(menuContainer, tripEventsContainer, tripPresenter, eventsModel) {
    this._menuContainer = menuContainer;
    this._tripEventsContainer = tripEventsContainer;

    this._tripPresenter = tripPresenter;

    this._eventsModel = eventsModel;

    this._filterComponent = null;
    this._statsComponent = null;

    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);
  }

  init() {
    this._siteMenuComponent = new SiteMenu();
    renderElement(this._menuContainer, this._siteMenuComponent, RenderPosition.AFTEREND);

    this._siteMenuComponent.setMenuClickHandler(this._handleSiteMenuClick);
  }

  _handleSiteMenuClick(menuItem) {
    this._siteMenuComponent.setActiveMenu(menuItem);
    switch (menuItem) {
      case MENU.STATISTIC:
        if (this._statsComponent !== null) { // сбросить компонент. fix некорректную калькуляцию высоты графиков при ререндере
          removeCommponent(this._statsComponent);
          this._statsComponent = null;
        }
        this._statsComponent = new Stats(this._eventsModel.getEvents());
        this._tripPresenter.destroy();
        renderElement(this._tripEventsContainer, this._statsComponent, RenderPosition.BEFOREEND);
        this._statsComponent.init();
        break;
      case MENU.TABLE:
        this._tripPresenter.init();
        removeCommponent(this._statsComponent);
        break;
    }
  }
}
