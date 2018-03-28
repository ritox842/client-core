/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Observable';

@Directive({
  selector: '[datoOrigin]'
})
export class DatoOriginDirective {
  click = fromEvent(this.element, 'click');

  constructor(public host: ElementRef) {}

  get element() {
    return this.host.nativeElement;
  }
}
