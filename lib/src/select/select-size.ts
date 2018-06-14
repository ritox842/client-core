import { SelectSize, SelectType } from './select.types';

const sizes = {
  single: {
    sm: 30,
    md: 35,
    lg: 35
  },
  multi: {
    sm: 30,
    md: 35,
    lg: 35
  }
};

/**
 *
 * @param {SelectType} type
 * @param {SelectSize} size
 * @returns {any}
 */
export function getSelectOptionHeight(type: SelectType, size: SelectSize) {
  return sizes[type][size];
}
