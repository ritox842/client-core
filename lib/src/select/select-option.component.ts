/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'dato-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dato-select__option">
      <ng-content></ng-content>
    </div>
  `
})
export class DatoSelectOptionComponent {
  @Input() option;

  _option = false;

  constructor(private cdr: ChangeDetectorRef) {}
}
