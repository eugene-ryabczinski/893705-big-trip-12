import {renderElement, RenderPosition, replace, removeCommponent} from '../utils/render';
import TripEventItem from '../view/trip-event-Item';
import TripEventItemEdit from '../view/trip-event-item-edit';

export default class Event {
  constructor(tripEventsListContainer, changeData) {
    this._tripEventsListConteiner = tripEventsListContainer;
    this._changeData = changeData;

    this._tripEventItemComponent = null;
    this._tripEventItemEditComponent = null;

    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEcs = this._handleEcs.bind(this);
    this._isFavouriteClick = this._isFavouriteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevTripEventItemComponent = this._tripEventItemComponent;
    const prevTripEventItemEditComponent = this._tripEventItemEditComponent;

    this._tripEventItemComponent = new TripEventItem(event);
    this._tripEventItemEditComponent = new TripEventItemEdit(event);

    this._tripEventItemComponent.setRollupEventClickHandler(this._handleRollupClick);
    this._tripEventItemEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventItemEditComponent.setFavouriteClickHandler(this._isFavouriteClick);

    if (prevTripEventItemComponent === null || prevTripEventItemEditComponent === null) {
      renderElement(this._tripEventsListConteiner.getElement(), this._tripEventItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._tripEventsListConteiner.getElement().contains(prevTripEventItemComponent.getElement())) {
      replace(this._tripEventItemComponent, prevTripEventItemComponent);
    }

    if (this._tripEventsListConteiner.getElement().contains(prevTripEventItemEditComponent.getElement())) {
      replace(this._tripEventItemEditComponent, prevTripEventItemEditComponent);
    }

    removeCommponent(prevTripEventItemComponent);
    removeCommponent(prevTripEventItemEditComponent);
  }

  destroy() {
    removeCommponent(this._tripEventItemComponent);
    removeCommponent(this._tripEventItemEditComponent);
    removeCommponent(this._tripEventsListConteiner); // remove container
  }

  _replaceEventToForm() {
    replace(this._tripEventItemEditComponent, this._tripEventItemComponent);
    document.addEventListener(`keydown`, this._handleEcs);
  }

  _replaceFormToEvent() {
    replace(this._tripEventItemComponent, this._tripEventItemEditComponent);
    document.removeEventListener(`keydown`, this._handleEcs);
  }

  _handleRollupClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit(tripEvent) {
    this._replaceFormToEvent();
    this._changeData(tripEvent);
  }

  _handleEcs(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._handleEcs);
    }
  }

  _isFavouriteClick(evt) {
    let updated = Object.assign({}, this._event, {isFavourite: evt}); // this._event.isFavourite = evt;
    this._changeData(updated);
  }
}

