import {renderElement, RenderPosition, replace, removeCommponent} from '../utils/render';
import TripEventItem from '../view/trip-event-Item';
import TripEventItemEdit from '../view/trip-event-item-edit';
import {USER_ACTION, UPDATE_TYPE, MODE, STATE} from '../const';

export default class Event {
  constructor(tripEventsListContainer, changeData, changeMode, offersModel, destinationsModel) {
    this._tripEventsListConteiner = tripEventsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = MODE.DEFAULT;

    this._tripEventItemComponent = null;
    this._tripEventItemEditComponent = null;

    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEventDeleteClick = this._handleEventDeleteClick.bind(this);
    this._handleEcs = this._handleEcs.bind(this);
    this._isFavouriteClick = this._isFavouriteClick.bind(this);
  }

  init(event, offers, destinations) {
    this._event = event;
    this._offers = offers;
    this._destinations = destinations;

    const prevTripEventItemComponent = this._tripEventItemComponent;
    const prevTripEventItemEditComponent = this._tripEventItemEditComponent;

    this._tripEventItemComponent = new TripEventItem(event, this._offers, this._destinations);
    this._tripEventItemEditComponent = new TripEventItemEdit(event, this._offers, this._destinations);

    this._tripEventItemComponent.setRollupEventClickHandler(this._handleRollupClick);
    this._tripEventItemEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventItemEditComponent.setDeleteClickHandle(this._handleEventDeleteClick);
    this._tripEventItemEditComponent.setFavouriteClickHandler(this._isFavouriteClick);

    if (prevTripEventItemComponent === null || prevTripEventItemEditComponent === null) {
      renderElement(this._tripEventsListConteiner.getElement(), this._tripEventItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === MODE.DEFAULT) {
      replace(this._tripEventItemComponent, prevTripEventItemComponent);
    }

    if (this._mode === MODE.EDITING) {
      // replace(this._tripEventItemEditComponent, prevTripEventItemEditComponent);
      replace(this._tripEventItemComponent, prevTripEventItemEditComponent);
      this._mode = MODE.DEFAULT;
    }

    removeCommponent(prevTripEventItemComponent);
    removeCommponent(prevTripEventItemEditComponent);
  }

  resetView() {
    if (this._mode !== MODE.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  destroy() {
    removeCommponent(this._tripEventItemComponent);
    removeCommponent(this._tripEventItemEditComponent);
    removeCommponent(this._tripEventsListConteiner);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._tripEventItemEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case STATE.SAVING:
        this._tripEventItemEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case STATE.DELETING:
        this._tripEventItemEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case STATE.ABORTING:
        this._tripEventItemComponent.shake(resetFormState);
        this._tripEventItemEditComponent.shake(resetFormState);
        break;
    }
  }

  _replaceEventToForm() {
    replace(this._tripEventItemEditComponent, this._tripEventItemComponent);
    document.addEventListener(`keydown`, this._handleEcs);
    this._changeMode();
    this._mode = MODE.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._tripEventItemComponent, this._tripEventItemEditComponent);
    document.removeEventListener(`keydown`, this._handleEcs);
    this._mode = MODE.DEFAULT;
  }

  _isCostChanged(cost) { // если цена поменялась – делай ререндер всех ивентов т.е. может быть активна сортировка по цене? возможно есть способ сравнения получше
    if (this._event.cost !== cost) {
      return true;
    }
    return false;
  }

  _handleRollupClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit(tripEvent) {
    let updateType = UPDATE_TYPE.PATCH;

    if (this._isCostChanged(tripEvent.cost)) {
      updateType = UPDATE_TYPE.MINOR;
    }

    // this._replaceFormToEvent();
    this._changeData(
        USER_ACTION.UPDATE_EVENT,
        updateType,
        tripEvent
    );
  }

  _handleEventDeleteClick(tripEvent) {
    this._changeData(
        USER_ACTION.DELETE_EVENT,
        UPDATE_TYPE.MINOR,
        tripEvent
    );
  }

  _handleEcs(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._tripEventItemEditComponent.reset(this._event);
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._handleEcs);
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
