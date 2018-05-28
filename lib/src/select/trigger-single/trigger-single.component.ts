/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { DatoSelectActiveDirective } from '../select-active.directive';

@Component({
  selector: 'dato-trigger-single',
  templateUrl: './trigger-single.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [`./trigger-single.component.scss`]
})
export class DatoTriggerSingle {
  @Input() active: DatoSelectActiveDirective;
  @Input() placeholder = '';

  @Input()
  set model(value) {
    if (value.length) {
      this._model = { $implicit: value[0] };
    }
    //this.cdr.detectChanges();
  }

  get hidePlaceholder() {
    return !this._model || !this._model.$implicit;
  }

  _model;

  //constructor(private cdr: ChangeDetectorRef) {}
}
