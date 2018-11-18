/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[aceDraggableText]'
})
export class DatoAceDraggableDirective {
  private text: string;

  @Input()
  set aceDraggableText(value: string) {
    this.text = value;
  }

  constructor(private host: ElementRef<HTMLElement>) {
    this.host.nativeElement.setAttribute('draggable', 'true');
  }

  @HostListener('dragstart', ['$event'])
  private drag(event: DragEvent) {
    event.dataTransfer.setData('text', this.text);
  }
}
