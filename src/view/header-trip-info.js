import AbstractView from './abstract-view';

export const createHeaderTripInfoTemplate = ({route, duration, cost}) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>

        <p class="trip-info__dates">${duration}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`
  );
};

export default class HeaderTripInfo extends AbstractView{
  constructor(tripInfo) {
    super()
    this._tripInfo = tripInfo;
  }

  getTemplate() {
    return createHeaderTripInfoTemplate(this._tripInfo);
  }
}
