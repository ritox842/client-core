/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[datoSortableHandle]'
})
export class DatoSortableHandleDirective {
  constructor(private renderer: Renderer2, private host: ElementRef) {
    renderer.addClass(host.nativeElement, 'dato-sortable-handler');
  }
}
