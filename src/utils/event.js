import {groupBy} from '../utils/common';
import {FILTER_TYPE} from '../const';
import moment from 'moment';

export const groupEventsByDay = (events) => {
  const sortedDates = events.slice();

  sortedDates
    .sort((event, event2) => {
      const date1 = event.endDate;
      const date2 = event2.startDate;

      if (date1 > date2) {
        return 1;
      }

      if (date1 < date2) {
        return -1;
      }

      return 0;
    });

  const groupedByDates = groupBy(sortedDates, (item) => {
    return moment(item.startDate).startOf(`day`).format();
  });

  return groupedByDates;
};

export const sortByDuration = (dayA, dayB) => {
  const momentStartA = moment(dayA.startDate);
  const momentEndA = moment(dayA.endDate);
  const diffA = momentEndA.diff(momentStartA);

  const momentStartB = moment(dayB.startDate);
  const momentEndB = moment(dayB.endDate);
  const diffB = momentEndB.diff(momentStartB);

  return diffB - diffA;
};

export const sortByPrice = (dayA, dayB) => {
  return dayB.cost - dayA.cost;
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const filter = {
  [FILTER_TYPE.EVERYTHING]: (events) => {
    return events;
  },
  [FILTER_TYPE.PAST]: (events) => {
    return events.filter((event) => {
      const currentDay = new moment();
      const eventEndDate = moment(event.endDate);
      return eventEndDate < currentDay;
    });
  },
  [FILTER_TYPE.FUTERE]: (events) => {
    return events.filter((event) => {
      const currentDay = new moment();
      const eventStartDate = moment(event.startDate);
      return eventStartDate > currentDay;
    });
  }
};
