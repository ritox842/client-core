/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[datoDisableControl]'
})
export class DatoDisableControlDirective {
  @Input()
  set datoDisableControl(condition: boolean) {
    if (this.ngControl.control.disabled !== condition) {
      const action = condition ? 'disable' : 'enable';
      this.ngControl.control[action]({ emitEvent: false });
    }
  }

  constructor(private ngControl: NgControl) {}
}
