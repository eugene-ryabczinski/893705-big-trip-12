export const CITIES = [`Amsterdam`, `Chamonix`, `Geneva`];

export const EVENT_TRANSFER_LIST = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];
export const EVENT_ACTIVITIES_LIST = [`Check-in`, `Sightseeing`, `Restaurant`];
export const EVENT_TYPES = [...EVENT_TRANSFER_LIST,  ...EVENT_ACTIVITIES_LIST];

export const SORT_TYPE = {
  EVENT: `sort-event`,
  PRICE: `sort-price`,
  TIME: `sort-time`
};
