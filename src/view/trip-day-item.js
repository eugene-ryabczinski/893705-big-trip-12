import moment from 'moment';

export const createTripDayItemTemplate = (day, index) => {
  const formatedDate = moment(day).format(`MMM DD`)
  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${day}">${formatedDate}</time>
      </div>
    </li>`
  );
};
