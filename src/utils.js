import { groupBy, range } from 'lodash';

export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export { groupBy, range }