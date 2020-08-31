import {groupBy, range, isEqual, random, cloneDeep, isNumber} from 'lodash';

export {groupBy, range, isEqual, random, cloneDeep, isNumber};

export const updateItem = (source, updatedItem) => {
  const index = source.findIndex((item) => item.id === updatedItem.id);

  if (index < 0) {
    return source;
  } else {
    source[index] = cloneDeep(updatedItem);
    return source;
  }
};
