import Observer from '../utils/observer';

export default class OffersModel extends Observer {
  constructor() {
    super();
    this._offers = null;
  }

  setOffers(updateType, offers) {
    this._offers = offers;
    this._notify(updateType, offers);
  }

  getOffers() {
    return this._offers;
  }

  static adaptToClient(offer) {
    const adaptedOffer = Object.assign(
        {},
        offer,
        {
          offers: offer.offers.map((off) => {
            return {
              cost: off.price,
              name: off.title
            };
          })
        }
    );

    return adaptedOffer;
  }
}
