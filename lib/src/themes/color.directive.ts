/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, Input, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[datoColor]'
})
export class ColorDirective {
  private supportProperties = ['background', 'border'];
  private lastKlass;

  /** Example: <div datoColor="primary-100, accent-200 border-left border-right">text</div> */
  @Input()
  set datoColor(color: string) {
    if (!color) return;
    /** ["primary-100", "accent-200 border-left border-right"] */
    const colors = color.split(',');

    colors.forEach(color => {
      /**
       * split equal to:
       * ["primary-100"]
       * ["accent-200", "border-left", "border-right"]
       */
      const split = color.trim().split(' ');
      const [colorVar] = split;

      /** If it's the only key it should be the color value */
      if (split.length === 1) {
        const klass = `${colorVar}-color`;
        if (this.lastKlass) {
          this.renderer.removeClass(this.host.nativeElement, this.lastKlass);
        }
        this.renderer.addClass(this.host.nativeElement, klass);
        this.lastKlass = klass;
        return;
      }

      /** Remove the first value (the color value) */
      split.slice(1).forEach(prop => {
        let klass = `${colorVar}-${prop}`;

        /** Add the color key to borders */
        if (this.supportProperties.indexOf(prop) > -1) {
          klass = `${colorVar}-${prop}-color`;
        }

        if (this.lastKlass) {
          this.renderer.removeClass(this.host.nativeElement, this.lastKlass);
        }

        this.renderer.addClass(this.host.nativeElement, klass);
        this.lastKlass = klass;
      });
    });
  }

  constructor(private renderer: Renderer2, private host: ElementRef) {}
}
