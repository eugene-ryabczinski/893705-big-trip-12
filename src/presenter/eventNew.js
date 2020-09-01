import {renderElement, RenderPosition, replace, removeCommponent} from '../utils/render';
import TripEventItem from '../view/trip-event-Item';
import TripEventItemEdit from '../view/trip-event-item-edit';
import {USER_ACTION, UPDATE_TYPE} from '../const';
import {generateId} from '../utils/event'

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class EventNew {
  constructor(tripEventsListContainer, changeData) {
    this._tripEventsListConteiner = tripEventsListContainer;
    this._changeData = changeData;

    this._tripEventItemEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEventDeleteClick = this._handleEventDeleteClick.bind(this);
    this._handleEcs = this._handleEcs.bind(this);
    this._isFavouriteClick = this._isFavouriteClick.bind(this);
  }

  init(event) {
    this._event = event;

    this._tripEventItemEditComponent = new TripEventItemEdit(event);

    this._tripEventItemEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventItemEditComponent.setDeleteClickHandle(this._handleEventDeleteClick);
    this._tripEventItemEditComponent.setFavouriteClickHandler(this._isFavouriteClick);

    // if (prevTripEventItemComponent === null || prevTripEventItemEditComponent === null) {
      renderElement(this._tripEventsListConteiner.getElement(), this._tripEventItemEditComponent, RenderPosition.BEFOREBEGIN);
      // return;
    // }

    // if (this._mode === Mode.DEFAULT) {
    //   replace(this._tripEventItemComponent, prevTripEventItemComponent);
    // }

    // if (this._mode === Mode.EDITING) {
    //   replace(this._tripEventItemEditComponent, prevTripEventItemEditComponent);
    // }

    // removeCommponent(prevTripEventItemComponent);
    // removeCommponent(prevTripEventItemEditComponent);
  }

  // resetView() {
  //   if (this._mode !== Mode.DEFAULT) {
  //     this._replaceFormToEvent();
  //   }
  // }

  destroy() {
    removeCommponent(this._tripEventItemEditComponent);
    // removeCommponent(this._tripEventsListConteiner); // remove container?
    document.removeEventListener(`keydown`, this._handleEcs);
  }

  // _replaceEventToForm() {
  //   replace(this._tripEventItemEditComponent, this._tripEventItemComponent);
  //   document.addEventListener(`keydown`, this._handleEcs);
  //   this._changeMode();
  //   this._mode = Mode.EDITING;
  // }

  // _replaceFormToEvent() {
  //   replace(this._tripEventItemComponent, this._tripEventItemEditComponent);
  //   document.removeEventListener(`keydown`, this._handleEcs);
  //   this._mode = Mode.DEFAULT;
  // }


  _handleFormSubmit(tripEvent) {
    let updateType = UPDATE_TYPE.MINOR;

    // this._replaceFormToEvent();
    this._changeData(
      USER_ACTION.ADD_EVENT,
      updateType,
      Object.assign({id: generateId()}, tripEvent)
      // tripEvent
    );
    this.destroy();
  }

  _handleEventDeleteClick(tripEvent) { // change to cancel
    this.destroy();
    // this._changeData(
    //   USER_ACTION.DELETE_EVENT,
    //   UPDATE_TYPE.MINOR,
    //   tripEvent
    // );
  }

  _handleEcs(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
      // this._tripEventItemEditComponent.reset(this._event);
      // this._replaceFormToEvent();
      // document.removeEventListener(`keydown`, this._handleEcs);
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
