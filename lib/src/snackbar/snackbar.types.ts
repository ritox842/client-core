/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

/**
 * Snackbar messages types
 */
export enum SnackbarType {
  INFO,
  SUCCESS,
  ERROR,
  DRAMATIC_SUCCESS,
  DRAMATIC_ERROR
}

/**
 * Snackbar Options
 */
export type SnackbarOptions = {
  text: string;
  type: SnackbarType;
  dismissible: boolean;
  undoFunction: Function | null;
  detailsFunction: Function | null;
};

/**
 *
 * @returns {SnackbarOptions}
 */
export function getDefaults(): SnackbarOptions {
  return {
    text: '',
    type: SnackbarType.INFO,
    dismissible: false,
    undoFunction: null,
    detailsFunction: null
  };
}
