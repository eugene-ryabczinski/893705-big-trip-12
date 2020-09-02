import {renderElement, RenderPosition, removeCommponent} from '../utils/render';
import {NEW_EVENT} from '../view/trip-event-item-edit';
import TripEventItemEdit from '../view/trip-event-item-edit';
import {USER_ACTION, UPDATE_TYPE} from '../const';
import {generateId} from '../utils/event';

export default class EventNew {
  constructor(tripEventsMainContainerElement, changeData, changeMode, eventsModel) {
    this._tripEventsMainContainerElement = tripEventsMainContainerElement;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._eventsModel = eventsModel;

    this._tripEventItemEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEventDeleteClick = this._handleEventDeleteClick.bind(this);
    this._handleEcs = this._handleEcs.bind(this);
    this._isFavouriteClick = this._isFavouriteClick.bind(this);
  }

  init() {
    this._event = NEW_EVENT;// создаём пустой ивент?

    this._tripEventItemEditComponent = new TripEventItemEdit(this._event);

    this._tripEventItemEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventItemEditComponent.setDeleteClickHandle(this._handleEventDeleteClick);
    this._tripEventItemEditComponent.setFavouriteClickHandler(this._isFavouriteClick);

    if (this._eventsModel.getEvents().length > 0) {
      const tripDaysList = this._tripEventsMainContainerElement.querySelector(`.trip-days`);
      renderElement(tripDaysList, this._tripEventItemEditComponent, RenderPosition.BEFOREBEGIN);
    } else {
      renderElement(this._tripEventsMainContainerElement, this._tripEventItemEditComponent, RenderPosition.BEFOREEND);
    }

    document.addEventListener(`keydown`, this._handleEcs);
  }

  resetView() {
    removeCommponent(this._tripEventItemEditComponent);
    document.removeEventListener(`keydown`, this._handleEcs);
  }

  destroy() {
    this._changeMode();
  }

  _handleFormSubmit(tripEvent) {
    let updateType = UPDATE_TYPE.MINOR;

    this._changeData(
        USER_ACTION.ADD_EVENT,
        updateType,
        Object.assign({id: generateId()}, tripEvent)
    );
    this.destroy();
  }

  _handleEventDeleteClick(tripEvent) {
    tripEvent = null;
    this.destroy();
    this._changeData(USER_ACTION.ADD_EVENT, UPDATE_TYPE.MINOR, tripEvent); // вызвать апдейт листа без значения
  }

  _handleEcs(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._tripEventItemEditComponent.reset(this._event);
      document.removeEventListener(`keydown`, this._handleEcs);
      this.destroy();
      this._changeData(USER_ACTION.ADD_EVENT, UPDATE_TYPE.MINOR, null); // вызвать апдейт листа без значения
    }
  }

  _isFavouriteClick(evt, data) {
    let updated = Object.assign({}, data, {isFavourite: evt});
    this._changeData(
        USER_ACTION.UPDATE_EVENT,
        UPDATE_TYPE.PATCH,
        updated
    );
  }
}

