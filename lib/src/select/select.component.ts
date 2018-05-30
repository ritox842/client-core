/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseCustomControl } from '../internal/base-custom-control';
import { Overlay, OverlayConfig, OverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DatoOptionDirective } from './select-option.directive';
import { DatoSelectActiveDirective } from './select-active.directive';
import { coerceArray } from '@datorama/utils';
import { SelectType } from './select.types';
import { delay } from 'helpful-decorators';
import { Subscription } from 'rxjs/Subscription';
import { DatoSelectOptionComponent } from './select-option.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'datoSelect'
})
export class DatoSelectComponent extends BaseCustomControl implements OnInit, OnDestroy, ControlValueAccessor, AfterContentInit {
  @ViewChild('dropdown') dropdown: TemplateRef<any>;
  @ViewChild(OverlayOrigin) origin: OverlayOrigin;
  @ContentChildren(DatoOptionDirective) options: QueryList<DatoOptionDirective>;
  @ContentChild(DatoSelectActiveDirective) active: DatoSelectActiveDirective;

  @Input() idKey = 'id';
  @Input() placeholder = '';
  @Input() isCombo = true;
  @Input() isGroup = false;
  @Input() labelKey = 'label';
  @Input() groupByKey = 'group';
  @Input() internalSearch = true;
  @Input() type: SelectType = SelectType.SINGLE;
  @Input() noItemsLabel = 'No items found';

  @Output() search = new EventEmitter<string>();

  focus = false;
  model = [];
  searchControl = new FormControl();
  context;
  disabled;

  private overlayRef: OverlayRef;
  private searchSubscription: Subscription;
  private _open = false;

  get searchValue() {
    return this.searchControl.value;
  }

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

  ngOnInit() {
    this.listenToSearch();
  }

  listenToSearch() {
    if (this.search.observers.length) {
      this.searchSubscription = this.searchControl.valueChanges.subscribe(val => {
        this.search.emit(val);
      });
    }
  }

  ngAfterContentInit(): void {}

  click({ target }: MouseEvent) {
    if (this.open) return;

    const { width } = (this.origin.elementRef.nativeElement as HTMLElement).getBoundingClientRect();

    this.toggle();

    const strategy = this.overlay.position().connectedTo(
      this.origin.elementRef,
      {
        originX: 'start',
        originY: 'bottom'
      },
      { overlayX: 'start', overlayY: 'top' }
    );

    const config = new OverlayConfig({
      positionStrategy: strategy,
      width,
      hasBackdrop: false,
      backdropClass: 'dato-select',
      panelClass: 'dato-select'
    });
    this.overlayRef = this.overlay.create(config);
    this.overlayRef.attach(new TemplatePortal(this.dropdown, this.viewContainerRef));
    //this.overlayRef.backdropClick().subscribe(event => this.close());
    if (this.open) {
      this.focus = true;
      this.cdr.detectChanges();
    }
  }

  select(event: MouseEvent, option) {
    if (this.isSingle) {
      this.model = [option[this.idKey]];
      this.onChange(option[this.idKey]);
      this.context = option;
    }
    this.close();
  }

  close() {
    this.overlayRef && this.overlayRef.dispose();
    this.toggle();
    //this.searchControl.patchValue('');
  }

  canOpen(element: HTMLElement) {
    return element.tagName.toLowerCase() === 'dato-trigger-single';
  }

  toggle() {
    this.open = !this.open;
    this.cdr.markForCheck();
  }

  isActive(option) {
    return this.model.indexOf(option[this.idKey]) > -1;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  writeValue(activeIds): void {
    if (this.isSingle && activeIds) {
      this.setContext(activeIds);
    }

    const normalized = activeIds ? coerceArray(activeIds) : [];
    this.model = normalized.map(option => option[this.idKey]);
  }

  @delay()
  setContext(id) {
    const found = this.options.find(datoOption => datoOption.option[this.idKey] === id);
    if (found) {
      this.context = found.option;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
  }
}
