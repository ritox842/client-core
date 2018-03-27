/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';
import { SnackbarType } from '../snackbar/snackbar.types';
import { DatoTranslateService } from './translate.service';

@Injectable()
export class DatoSnackbar {
  constructor(private translate: DatoTranslateService) {}

  /**
   *
   * @param {SnackbarType} type
   * @param {string} msg
   */
  snack(type: SnackbarType, msg: string) {
    console.info(this.translate.transform(msg));
  }

  /**
   *
   * @param {string} msg
   */
  info(msg: string) {
    this.snack(SnackbarType.INFO, msg);
  }

  /**
   *
   * @param {string} msg
   */
  success(msg: string) {
    this.snack(SnackbarType.SUCCESS, msg);
  }

  /**
   *
   * @param {string} msg
   */
  error(msg: string) {
    this.snack(SnackbarType.ERROR, msg);
  }

  /**
   *
   * @param {string} msg
   */
  dramaticSuccess(msg: string) {
    this.snack(SnackbarType.DRAMATIC_SUCCESS, msg);
  }

  /**
   *
   * @param {string} msg
   */
  dramaticError(msg: string) {
    this.snack(SnackbarType.DRAMATIC_ERROR, msg);
  }
}
