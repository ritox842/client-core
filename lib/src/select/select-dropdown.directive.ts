/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ContentChildren, Directive, ElementRef, HostListener } from '@angular/core';
import { DatoSelectOptionComponent } from './select-option.component';

@Directive({
  selector: '[datoSelectDropdown]'
})
export class DatoSelectDropdownDirective {
  @ContentChildren(DatoSelectOptionComponent) op;

  ngAfterContentInit() {}
  @HostListener('click', ['$event'])
  onClick(event) {
    console.log(event.target);
  }

  constructor(private host: ElementRef) {}
}
