/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'dato-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dato-select__option dato-select__group">
      <ng-content select="[groupLabel]"></ng-content>
    </div>
    <ng-content></ng-content>
  `
})
export class DatoGroupComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detach();
  }
}
