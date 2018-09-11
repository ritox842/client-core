/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

export enum SelectType {
  SINGLE = 'single',
  MULTI = 'multi'
}

export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * The maximum number of options to display in the trigger
 * @type {number}
 */
export const defaultOptionsDisplayLimit = 10;
