import moment from 'moment';

export const getTripInfo = (events) => {
  const getDuration = () => {
    const days = Object.keys(events);

    const start = moment(days[0]).format(`MMM DD`);
    const end = moment(days[days.length - 1]).format(`DD`);

    const result = `${start} – ${end}`;

    return result.toUpperCase();
  };

  const getRoutePoints = () => {
    const route = Object.values(events).map((eventsByDay) => {
      return eventsByDay[0].destination;
    });
    return route.slice(0, -1).join(` &mdash; `) + ` &mdash; ` + route.slice(-1);
  };

  const getTotalCost = () => {
    const totalCost = Object.values(events).reduce((total, amount) => {
      const totalCostyDay = amount.reduce((totalByDay, amountByDay) => {
        return totalByDay + amountByDay.cost;
      }, 0);
      return total + totalCostyDay;
    }, 0);
    return totalCost;
  };

  return {
    route: getRoutePoints(),
    duration: getDuration(),
    cost: getTotalCost()
  };
};
