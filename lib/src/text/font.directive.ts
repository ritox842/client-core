/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Attribute, Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { typographyType } from './font.types';
import { DatoCoreError } from '../errors';

/**
 *
 * @param {string} klass
 */
function assertClassName(klass: string) {
  const klasses = ['headline', 'sub-headline', 'simple', 'simple-bold', 'simple-italic', 'note', 'note-bold', 'note-italic'];
  if (klasses.indexOf(klass) === -1) {
    throw new DatoCoreError(`datoFont - ${klass} doesn't exists`);
  }
}

@Directive({
  selector: '[datoFont]'
})
export class DatoFontDirective implements OnInit {
  constructor(private renderer: Renderer2, private element: ElementRef, @Attribute('datoFont') private datoFont: typographyType) {
    this.datoFont = datoFont || 'simple';
    assertClassName(this.datoFont);
  }

  ngOnInit(): void {
    this.injectTypographyClass();
  }

  private injectTypographyClass() {
    this.renderer.addClass(this.element.nativeElement, this.datoFont);
  }
}
