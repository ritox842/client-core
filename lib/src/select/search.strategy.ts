/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

/**
 * DatoSelectSearchStrategy - Interface for custom search strategies
 */
export interface DatoSelectSearchStrategy {
  (searchIn: any, searchValue: string, labelKey?: string): boolean;
}

/**
 * The default search strategy is compare lowercased strings
 * @param {any} searchIn
 * @param {string} searchValue
 * @param {string} labelKey
 * @returns {boolean}
 */
export const defaultClientSearchStrategy: DatoSelectSearchStrategy = (searchIn: any, searchValue: string, labelKey: string) => {
  const option = searchIn.option || searchIn;

  return option[labelKey].toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
};
