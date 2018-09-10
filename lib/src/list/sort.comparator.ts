/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

/**
 * Sort Comparator
 */
export interface DatoListSortComparator {
  (a: string, b: string, searchTerm?: string): [number, number];
}

const EXACT_MACTH_SCORE = 1000;
const START_WITH_SCORE = 10;

export const SORT_ORDER = 0;
export const SORT_SCORE = 1;

/**
 * Sorting alphabetically for non-search results. For search results according to the following:
 * 1. Exact Match.
 * 2. Start with.
 * 3. Contains.
 * 4. Alphabetically
 * @param {string} a
 * @param {string} b
 * @param {string} searchTerm
 * @return {[number , number]}
 */
export const defaultClientSortComparator: DatoListSortComparator = (a: string, b: string, searchTerm?: string): [number, number] => {
  if (searchTerm) {
    const aLC = a.toLowerCase(),
      bLC = b.toLowerCase();

    // exact match
    const aExactMatch: boolean = aLC === searchTerm;
    const bExactMatch: boolean = bLC === searchTerm;

    if (aExactMatch || bExactMatch) {
      return [+bExactMatch - +aExactMatch, EXACT_MACTH_SCORE];
    }

    // startWith
    const aStartWith = aLC.indexOf(searchTerm) === 0;
    const bStartWith = bLC.indexOf(searchTerm) === 0;

    if (aStartWith || bStartWith) {
      return [+bStartWith - +aStartWith, START_WITH_SCORE];
    }
  }

  // alphabetically
  return [a.localeCompare(b), 0];
};
