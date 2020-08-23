import {groupBy} from '../utils/common';
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
