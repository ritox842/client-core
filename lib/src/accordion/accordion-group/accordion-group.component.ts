/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { DatoAccordionContentComponent } from '../accordion-content/accordion-content.component';
import { DatoAccordionHeaderComponent } from '../accordion-header/accordion-header.component';

@Component({
  selector: 'dato-accordion-group',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [`./accordion-group.component.scss`]
})
export class DatoAccordionGroupComponent {
  @ContentChild(DatoAccordionContentComponent) content: DatoAccordionContentComponent;
  @ContentChild(DatoAccordionHeaderComponent) header: DatoAccordionHeaderComponent;
  @HostBinding('class.dato-accordion-disabled') _disabled = false;

  @Output() toggle = new EventEmitter<{ expanded: boolean }>();

  constructor(private cdr: ChangeDetectorRef) {}

  @Input()
  set disabled(value) {
    this._disabled = value;
    this.content.expanded = false;
    this.header.expanded = false;
    this.cdr.detectChanges();
  }
}
