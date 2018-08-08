/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

export enum SnackbarType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
  DRAMATIC_SUCCESS = 'dramatic-success',
  DRAMATIC_ERROR = 'dramatic-error'
}

/**
 * Snackbar Options
 */
export type SnackbarOptions = {
  /**
   * The length of time in milliseconds to wait before automatically dismissing the snack bar.
   */
  duration: number;
  /**
   * Whether to allow the X button
   */
  dismissible: boolean;
  icon?: string;
};

/**
 *
 * @returns {SnackbarOptions}
 */
export function getDefaults(): SnackbarOptions {
  return {
    duration: 4000,
    dismissible: false
  };
}
