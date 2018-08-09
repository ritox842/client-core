/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, Input, Renderer2, ElementRef } from '@angular/core';

export const enum Palette {
  LIGHT = 'light',
  Dark = 'dark'
}

@Directive({
  selector: '[datoPalette]'
})
export class PaletteDirective {
  currentClass = '';
  /**
   *  Will change the palette on the container to dark/light.
   */
  @Input()
  set datoPalette(palette: Palette) {
    if (this.currentClass) {
      this.renderer.removeClass(this.host.nativeElement, this.currentClass);
    }
    this.currentClass = palette;
    this.renderer.addClass(this.host.nativeElement, this.currentClass || Palette.LIGHT);
  }

  constructor(private renderer: Renderer2, private host: ElementRef) {}
}
