/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, forwardRef, Input, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseCustomControl } from '../internal/base-custom-control';
import { Overlay, OverlayConfig, OverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DatoOptioneDirective } from './select-option.directive';
import { DatoSelectActiveDirective } from './select-active.directive';
import { coerceArray } from '@datorama/utils';
import { Actives, SelectType } from './select.types';

const valueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatoSelectComponent),
  multi: true
};

@Component({
  selector: 'dato-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [valueAccessor],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoSelectComponent extends BaseCustomControl implements OnInit, OnDestroy, ControlValueAccessor, AfterContentInit {
  @ViewChild('dropdown') dropdown: TemplateRef<any>;
  @ViewChild(OverlayOrigin) origin: OverlayOrigin;
  @ContentChildren(DatoOptioneDirective) options: QueryList<DatoOptioneDirective>;
  @ContentChild(DatoSelectActiveDirective) active: DatoSelectActiveDirective;

  @Input() idKey = 'id';
  @Input() placeholder = '';
  @Input() type: SelectType = SelectType.SINGLE;

  focus = false;
  model = [];

  private overlayRef: OverlayRef;
  private _open = false;

  get open() {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
  }

  constructor(public overlay: Overlay, public viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef) {
    super();
  }

  get hasValue() {
    return this.model.length;
  }

  get isSingle() {
    return this.type === SelectType.SINGLE;
  }

  get isMulti() {
    return this.type === SelectType.MULTI;
  }

  get isAutoComplete() {
    return this.type === SelectType.AUTO_COMPLETE;
  }

  ngOnInit() {}

  ngAfterContentInit(): void {}

  click({ target }: MouseEvent) {
    const { width } = (this.origin.elementRef.nativeElement as HTMLElement).getBoundingClientRect();

    if (!this.canClose(target as HTMLElement) && this.open) {
      return;
    }

    this.toggle();

    const strategy = this.overlay.position().connectedTo(this.origin.elementRef, { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' });

    const config = new OverlayConfig({
      positionStrategy: strategy,
      width,
      hasBackdrop: true,
      backdropClass: 'dato-select',
      panelClass: 'dato-select'
    });
    this.overlayRef = this.overlay.create(config);
    this.overlayRef.attach(new TemplatePortal(this.dropdown, this.viewContainerRef));
    this.overlayRef.backdropClick().subscribe(event => this.close());
    this.focus = true;
  }

  select(event: MouseEvent, option) {
    if (this.isSingle) {
      this.model = [option];
    }
    this.close();
  }

  close() {
    this.overlayRef && this.overlayRef.dispose();
    this.toggle();
  }

  canClose(element: HTMLElement) {
    return element.tagName.toLowerCase() !== 'input';
  }

  toggle() {
    this.open = !this.open;
    this.cdr.detectChanges();
  }

  isActive(option) {
    return this.model.indexOf(option) > -1;
  }

  setDisabledState(isDisabled: boolean): void {}

  writeValue(actives: Actives): void {
    this.model = coerceArray(actives);
  }

  ngOnDestroy() {}
}
