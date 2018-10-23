/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Attribute, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[aceDraggableText]'
})
export class DatoAceDraggableDirective {
  constructor(private host: ElementRef<HTMLElement>, @Attribute('aceDraggableText') private text) {
    this.host.nativeElement.setAttribute('draggable', 'true');
  }

  @HostListener('dragstart', ['$event'])
  private drag(event) {
    event.dataTransfer.setData('text', this.text);
  }
}
