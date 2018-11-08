/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, ContentChildren, TemplateRef, QueryList } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { DatoSearchableDirective } from '../../directives/searchable.directive';

@Component({
  selector: 'dato-accordion-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [@slideInOut] *ngIf="_expanded" [@.disabled]="disableAnimation">
      <ng-container [ngTemplateOutlet]="template"></ng-container>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        overflow: hidden;
        display: block;
      }
    `
  ],
  animations: [trigger('slideInOut', [transition(':enter', [style({ height: '0px' }), animate('200ms', style({ height: '*' }))]), transition(':leave', [style({ height: '*' }), animate('200ms', style({ height: '0px' }))])])]
})
export class DatoAccordionContentComponent {
  @Input('tpl')
  template: TemplateRef<any>;

  @ContentChildren(DatoSearchableDirective)
  searchable: QueryList<DatoSearchableDirective>;

  _expanded: boolean = false;

  private _disableAnimation = false;

  get disableAnimation(): boolean {
    return this._disableAnimation;
  }

  set disableAnimation(value: boolean) {
    this._disableAnimation = value;
  }

  @Input()
  set expanded(value) {
    if (this._expanded !== value) {
      this._expanded = value;
      this.cdr.detectChanges();
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}
}
