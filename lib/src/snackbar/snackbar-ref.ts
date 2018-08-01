/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { EventEmitter } from '@angular/core';

export type SnackbarRefDismiss = {
  closedByAction: boolean;
};

export class SnackbarRef {
  private _afterDismissed: EventEmitter<SnackbarRefDismiss>;

  get afterDismissed() {
    return this._afterDismissed;
  }

  set afterDismissed(value) {
    this._afterDismissed = value;
  }
}
