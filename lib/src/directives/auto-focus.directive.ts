/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, ElementRef, Input } from '@angular/core';
import { toBoolean } from '@datorama/utils';

@Directive({
  selector: '[datoAutoFocus]'
})
export class DatoAutoFocusDirective {
  @Input()
  public set datoAutoFocus(value) {
    if (toBoolean(value)) {
      setTimeout(() => {
        this.host.nativeElement.focus();
      });
    }
  }

  public constructor(private host: ElementRef) {}
}
