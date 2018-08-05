import { SelectSize, SelectType } from './select.types';

const sizes = {
  sm: 30,
  md: 35,
  lg: 35
};

/**
 *
 * @param {SelectType} type
 * @param {SelectSize} size
 * @returns {any}
 */
export function getSelectOptionHeight(size: SelectSize) {
  return sizes[size];
}
