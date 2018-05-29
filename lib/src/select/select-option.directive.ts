/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectorRef, Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[datoOption]'
})
export class DatoOptionDirective {
  @Input('datoOption') option;

  @Input()
  set datoOptionDisabled(value: boolean) {
    this._disabled = value;
    this.cdr.markForCheck();
  }

  _disabled;

  constructor(public tpl: TemplateRef<any>, private cdr: ChangeDetectorRef) {}
}
