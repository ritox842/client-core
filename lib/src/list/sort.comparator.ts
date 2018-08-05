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
  (a: string, b: string, searchTerm?: string): number;
}

/**
 * Sorting alphabetically for non-search results. For search results according to the following:
 * 1. Exact Match.
 * 2. Start with.
 * 3. Contains.
 * 4. Alphabetically
 * @param a
 * @param b
 * @return {number}
 */
export const defaultClientSortComparator: DatoListSortComparator = (a: string, b: string, searchTerm?: string) => {
  if (searchTerm) {
    const aLC = a.toLowerCase(),
      bLC = b.toLowerCase();

    // exact match
    const aExactMatch = aLC === searchTerm;
    const bExactMatch = bLC === searchTerm;
    if (aExactMatch && !bExactMatch) {
      return -1;
    } else if (!aExactMatch && bExactMatch) {
      return 1;
    }

    // startWith
    const aStartWith = aLC.indexOf(searchTerm) === 0;
    const bStartWith = bLC.indexOf(searchTerm) === 0;

    if (aStartWith && !bStartWith) {
      return -1;
    } else if (!aStartWith && bStartWith) {
      return 1;
    }
  }

  // alphabetically
  return a.localeCompare(b);
};
