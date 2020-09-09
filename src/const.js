export const CITIES = [`Amsterdam`, `Chamonix`, `Geneva`];

export const EVENT_TRANSFER_LIST = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];
export const EVENT_ACTIVITIES_LIST = [`Check-in`, `Sightseeing`, `Restaurant`];
export const EVENT_TYPES = [...EVENT_TRANSFER_LIST,  ...EVENT_ACTIVITIES_LIST];

export const SORT_TYPE = {
  EVENT: `sort-event`,
  PRICE: `sort-price`,
  TIME: `sort-time`
};

export const FILTER_TYPE = {
  EVERYTHING: `everything`,
  FUTERE: `future`,
  PAST: `past`
};

export const USER_ACTION = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const MENU = {
  TABLE: `TABLE`,
  STATISTIC: `STATISTIC`,
};

export const UPDATE_TYPE = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const MODE = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
  CREATE: `CREATE`
};

