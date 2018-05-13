/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toBoolean } from '@datorama/utils';

@Component({
  selector: 'dato-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoButtonComponent {
  _disabled = false;

  /**
   *
   * @param value
   */
  @Input()
  set disabled(value) {
    this._disabled = toBoolean(value);
  }
}
