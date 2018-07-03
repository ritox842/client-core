import { ListSize } from './list.types';

const sizes = {
  sm: 30,
  md: 35,
  lg: 35
};

/**
 * @param {SelectSize} size
 * @returns {any}
 */
export function getListOptionHeight(size: ListSize) {
  return sizes[size];
}
