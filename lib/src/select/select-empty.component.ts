/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'dato-select-empty',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dato-select__option dato-select__not-found primary-300-color" *ngIf="_show">
      <ng-content></ng-content>
    </div>
  `
})
export class DatoSelectEmptyComponent {
  @Input()
  set show(value) {
    this._show = value;
  }

  _show = false;

  constructor(private cdr: ChangeDetectorRef) {}
}
