/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Attribute, Directive, ElementRef, OnInit, Optional, Renderer2 } from '@angular/core';
import { typographyType } from './font.types';
import { DatoCoreError } from '../errors';
import { ColorDirective } from '../themes/color.directive';

/**
 *
 * @param {string} klass
 */
function assertClassName(klass: string) {
  const klasses = ['headline', 'sub-headline', 'simple', 'simple-bold', 'simple-italic', 'note', 'note-bold', 'note-italic'];
  if (klasses.indexOf(klass) === -1) {
    throw new DatoCoreError(`datoFont - ${klass} doesn't exists. Valid options: ${klasses.join(', ')}`);
  }
}

@Directive({
  selector: '[datoFont]'
})
export class DatoFontDirective implements OnInit {
  constructor(private renderer: Renderer2, private host: ElementRef, @Attribute('datoFont') private datoFont: typographyType, @Optional() public datoColor: ColorDirective) {
    this.datoFont = datoFont || 'simple';
    if (this.datoColor) {
      /** Allow override the color */
      this.renderer.removeAttribute(this.host.nativeElement, 'datofont');
    }
    assertClassName(this.datoFont);
  }

  ngOnInit(): void {
    this.injectTypographyClass();
  }

  private injectTypographyClass() {
    this.renderer.addClass(this.host.nativeElement, this.datoFont);
  }
}
