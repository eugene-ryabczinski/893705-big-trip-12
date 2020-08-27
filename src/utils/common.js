import {groupBy, range, isEqual, random, cloneDeep} from 'lodash';

export {groupBy, range, isEqual, random};

export const updateItem = (source, updatedItem) => {
  const index = source.findIndex((item) => item.id === updatedItem.id);

  return index < 0 ? source : source[index] = cloneDeep(updatedItem);
}
