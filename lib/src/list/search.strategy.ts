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
export interface DatoListSearchStrategy {
  (searchIn: any, searchValue: string, labelKey?: string): boolean;
}

/**
 * The default search stratrgy is compare lowercased strings
 * @param {searchIn} item to search in
 * @param {string} searchValue
 * @param {string} labelKey
 * @returns {boolean}
 */
export const defaultClientSearchStrategy: DatoListSearchStrategy = (searchIn: any, searchValue: string, labelKey: string) => {
  return searchIn[labelKey] ? searchIn[labelKey].toLowerCase().indexOf(searchValue.toLowerCase()) > -1 : false;
};
